import express from "express";
import { CROP_CATALOG } from "../catalog/crops.js";

const router = express.Router();

async function fetchClimateSummary(latitude, longitude) {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);

  const start = new Date();
  start.setFullYear(start.getFullYear() - 5);
  const startDate = start.toISOString().slice(0, 10);

  const url =
    `https://archive-api.open-meteo.com/v1/archive` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}` +
    `&daily=temperature_2m_mean,temperature_2m_min,precipitation_sum` +
    `&timezone=Europe%2FParis`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo error: ${response.status}`);
  }

  const data = await response.json();

  const tMean = data?.daily?.temperature_2m_mean ?? [];
  const tMin = data?.daily?.temperature_2m_min ?? [];
  const precip = data?.daily?.precipitation_sum ?? [];

  if (!tMean.length || !tMin.length || !precip.length) {
    throw new Error("Open-Meteo returned incomplete climate data");
  }

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const tempMoyenne = avg(tMean);

  const sortedMin = [...tMin].sort((a, b) => a - b);
  const tempMinHivernale =
    sortedMin[Math.floor(0.05 * (sortedMin.length - 1))];

  const precipitationsAnnuelles =
    precip.reduce((a, b) => a + b, 0) / 5;

  return {
    tempMoyenne,
    tempMinHivernale,
    precipitationsAnnuelles,
  };
}

function buildJustification({
  crop,
  conditionsExploitation,
  scoreClimat,
  scoreSol,
  scoreSurface,
  scoreInfrastructure,
  scoreDemande,
  hasSerre,
  surfaceHa,
}) {
  const reasons = [];

  if (scoreClimat >= 28) {
    reasons.push(
      `le climat local est globalement favorable à ${crop.name.toLowerCase()}`
    );
  } else if (scoreClimat >= 18) {
    reasons.push(
      `le climat local est partiellement compatible avec ${crop.name.toLowerCase()}, mais avec certaines limites`
    );
  } else {
    reasons.push(
      `le climat local reste contraignant pour ${crop.name.toLowerCase()}`
    );
  }

  if (conditionsExploitation.tempMoyenne >= crop.climate.tmean.ideal[0] &&
      conditionsExploitation.tempMoyenne <= crop.climate.tmean.ideal[1]) {
    reasons.push(
      `la température moyenne (${conditionsExploitation.tempMoyenne.toFixed(1)}°C) se situe dans la plage favorable`
    );
  } else {
    reasons.push(
      `la température moyenne (${conditionsExploitation.tempMoyenne.toFixed(1)}°C) s’éloigne de la plage optimale`
    );
  }

  if (conditionsExploitation.tempMinHivernale >= crop.climate.winterMin.ideal[0]) {
    reasons.push(
      `le risque de froid hivernal reste acceptable`
    );
  } else {
    reasons.push(
      `le froid hivernal (${conditionsExploitation.tempMinHivernale.toFixed(1)}°C) impose une protection`
    );
  }

  if (scoreSol >= 16) {
    reasons.push(`les caractéristiques du sol sont plutôt compatibles`);
  } else if (scoreSol >= 10) {
    reasons.push(`le sol est exploitable mais pas idéal`);
  } else {
    reasons.push(`le sol constitue un facteur limitant`);
  }

  if (typeof surfaceHa === "number" && surfaceHa >= crop.surfaceMinHa) {
    reasons.push(
      `la surface disponible (${surfaceHa} ha) est suffisante pour envisager la culture`
    );
  } else {
    reasons.push(
      `la surface disponible semble limitée par rapport au besoin minimal (${crop.surfaceMinHa} ha)`
    );
  }

  if (crop.infra?.needsSerre) {
    if (hasSerre) {
      reasons.push(`la présence d’une serre améliore nettement la faisabilité`);
    } else {
      reasons.push(`une serre est recommandée pour sécuriser la production`);
    }
  }

  if (scoreDemande >= 12) {
    reasons.push(`le potentiel commercial est élevé sur le marché européen`);
  } else if (scoreDemande >= 8) {
    reasons.push(`le débouché commercial existe mais reste de niche`);
  } else {
    reasons.push(`le potentiel commercial est plus limité`);
  }

  return reasons.join(". ") + ".";
}

router.post("/analyze", async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      surfaceHa,
      hasSerre,
      irrigationType,
      objectifProduction,
      toleranceRisque,
    } = req.body ?? {};

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ error: "latitude/longitude invalides" });
    }

    const climate = await fetchClimateSummary(latitude, longitude);

    const conditionsExploitation = {
      tempMoyenne: climate.tempMoyenne,
      tempMinHivernale: climate.tempMinHivernale,
      precipitationsAnnuelles: climate.precipitationsAnnuelles,
      phSol: 6.5, // placeholder, luego SoilGrids
    };

    const results = CROP_CATALOG.map((c) => {
      let infraPenalty = 0;
      if (c.infra?.needsSerre && !hasSerre) infraPenalty += 10;
      if (c.infra?.needsIrrigation && irrigationType === "aucune") infraPenalty += 5;

      let scoreSurface = 10;
      if (typeof surfaceHa === "number" && surfaceHa < c.surfaceMinHa) {
        scoreSurface = Math.max(0, Math.round((surfaceHa / c.surfaceMinHa) * 10));
      }

      function scoreRange(value, idealMin, idealMax, tolMin, tolMax, maxPoints) {
        if (value >= idealMin && value <= idealMax) return maxPoints;

        if (value < idealMin) {
          if (value <= tolMin) return 0;
          const ratio = (value - tolMin) / (idealMin - tolMin);
          return Math.max(0, Math.round(ratio * maxPoints));
        }

        if (value > idealMax) {
          if (value >= tolMax) return 0;
          const ratio = (tolMax - value) / (tolMax - idealMax);
          return Math.max(0, Math.round(ratio * maxPoints));
        }

        return 0;
      }
      const scoreSol = 16; // /25 placeholder
      const scoreInfrastructure = Math.max(0, 10 - infraPenalty); // /10
      const scoreDemande = c.demandScore15 ?? 10; // /15

      const sTemp = scoreRange(
      conditionsExploitation.tempMoyenne,
      c.climate.tmean.ideal[0],
      c.climate.tmean.ideal[1],
      c.climate.tmean.tol[0],
      c.climate.tmean.tol[1],
      18
    );

    const sWinter = scoreRange(
      conditionsExploitation.tempMinHivernale,
      c.climate.winterMin.ideal[0],
      c.climate.winterMin.ideal[1],
      c.climate.winterMin.tol[0],
      c.climate.winterMin.tol[1],
      14
    );

    const sPrecip = scoreRange(
      conditionsExploitation.precipitationsAnnuelles,
      c.climate.precip.ideal[0],
      c.climate.precip.ideal[1],
      c.climate.precip.tol[0],
      c.climate.precip.tol[1],
      8
    );

    const scoreClimat = sTemp + sWinter + sPrecip; // /40

      const scoreTotal =
        scoreClimat + scoreSol + scoreSurface + scoreInfrastructure + scoreDemande;

      const niveauRisque =
        scoreTotal >= 70 ? "faible" : scoreTotal >= 50 ? "moyen" : "eleve";

      const modeConseille = c.infra?.needsSerre
        ? hasSerre
          ? "serre"
          : "serre_chauffee"
        : "plein_champ";

      const justification = buildJustification({
        crop: c,
        conditionsExploitation,
        scoreClimat,
        scoreSol,
        scoreSurface,
        scoreInfrastructure,
        scoreDemande,
        hasSerre,
        surfaceHa,
      });

      return {
        id: c.id,
        name: c.name,
        scientificName: c.scientificName,
        imageUrl: c.imageUrl,

        niveauRisque,
        modeConseille,
        scoreTotal,
        scoreClimat,
        scoreSol,
        scoreSurface,
        scoreInfrastructure,
        scoreDemande,

        justification,
        cultureGuide: c.guides?.cultureGuide ?? "",
        phytosanitaryRisks: c.guides?.phytosanitaryRisks ?? "",
        substitutionPotential: c.guides?.substitutionPotential ?? "",
      };
    })
      .sort((a, b) => b.scoreTotal - a.scoreTotal)
      .slice(0, 5);

    return res.json({
      conditionsExploitation,
      results,
      meta: {
        latitude,
        longitude,
        surfaceHa,
        hasSerre,
        irrigationType,
        objectifProduction,
        toleranceRisque,
      },
    });
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Erreur inconnue",
    });
  }
});

export default router;