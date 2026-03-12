import express from "express";
import { CROP_CATALOG } from "../catalog/crops.js";

const router = express.Router();

// Valeurs typiques pour le bassin nantais (fallback si SoilGrids indisponible)
const NANTES_SOIL_FALLBACK = {
  phSol: 6.2,
  socPct: 1.8,
  sandPct: 35,
  siltPct: 45,
  clayPct: 20,
};

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function scoreRange(value, idealMin, idealMax, tolMin, tolMax, maxPoints) {
  if (value == null) return 0;

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

  const tempMoyenne = avg(tMean);

  const sortedMin = [...tMin].sort((a, b) => a - b);
  const tempMinHivernale =
    sortedMin[Math.floor(0.05 * (sortedMin.length - 1))];

  const precipitationsAnnuelles = precip.reduce((a, b) => a + b, 0) / 5;

  return {
    tempMoyenne,
    tempMinHivernale,
    precipitationsAnnuelles,
  };
}

async function fetchSoilSummary(latitude, longitude) {
  const url =
    `https://rest.isric.org/soilgrids/v2.0/properties/query` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&property=phh2o` +
    `&property=soc` +
    `&property=sand` +
    `&property=silt` +
    `&property=clay` +
    `&depth=0-5cm` +
    `&value=mean`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      console.warn(`SoilGrids unavailable (${response.status}), using fallback values`);
      return { ...NANTES_SOIL_FALLBACK, isFallback: true };
    }

    const data = await response.json();

    const getMean = (name) => {
      const layer = data?.properties?.layers?.find((l) => l.name === name);
      const depth = layer?.depths?.find((d) => d.label === "0-5cm");
      return depth?.values?.mean ?? null;
    };

    const ph = getMean("phh2o");
    const soc = getMean("soc");
    const sand = getMean("sand");
    const silt = getMean("silt");
    const clay = getMean("clay");

    return {
      phSol: ph != null ? ph / 10 : NANTES_SOIL_FALLBACK.phSol,
      socPct: soc != null ? soc / 10 : NANTES_SOIL_FALLBACK.socPct,
      sandPct: sand != null ? sand / 10 : NANTES_SOIL_FALLBACK.sandPct,
      siltPct: silt != null ? silt / 10 : NANTES_SOIL_FALLBACK.siltPct,
      clayPct: clay != null ? clay / 10 : NANTES_SOIL_FALLBACK.clayPct,
      isFallback: false,
    };
  } catch (err) {
    console.warn("SoilGrids fetch failed, using fallback values:", err.message);
    return { ...NANTES_SOIL_FALLBACK, isFallback: true };
  }
}

function buildJustification({
  crop,
  conditionsExploitation,
  soil,
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

  if (
    conditionsExploitation.tempMoyenne >= crop.climate.tmean.ideal[0] &&
    conditionsExploitation.tempMoyenne <= crop.climate.tmean.ideal[1]
  ) {
    reasons.push(
      `la température moyenne (${conditionsExploitation.tempMoyenne.toFixed(1)}°C) se situe dans la plage favorable`
    );
  } else {
    reasons.push(
      `la température moyenne (${conditionsExploitation.tempMoyenne.toFixed(1)}°C) s'éloigne de la plage optimale`
    );
  }

  if (
    conditionsExploitation.tempMinHivernale >=
    crop.climate.winterMin.ideal[0]
  ) {
    reasons.push(`le risque de froid hivernal reste acceptable`);
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

  if (soil.isFallback) {
    reasons.push(
      `les données pédologiques utilisées sont des valeurs typiques du bassin nantais (service SoilGrids temporairement indisponible)`
    );
  } else {
    if (soil.phSol != null) {
      reasons.push(`le pH du sol (${soil.phSol.toFixed(1)}) a été estimé via SoilGrids`);
    }
    if (soil.sandPct != null) {
      reasons.push(`la texture présente environ ${soil.sandPct.toFixed(0)}% de sable`);
    }
    if (soil.socPct != null) {
      reasons.push(`la teneur en carbone organique estimée est de ${soil.socPct.toFixed(1)}%`);
    }
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
      reasons.push(`la présence d'une serre améliore nettement la faisabilité`);
    } else {
      reasons.push(`une serre est recommandée pour sécuriser la production`);
    }
  }

  if (scoreInfrastructure <= 3) {
    reasons.push(`les contraintes d'infrastructure réduisent fortement la faisabilité`);
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

function inferTextureLabel(soil) {
  const sand = soil?.sandPct;
  const silt = soil?.siltPct;
  const clay = soil?.clayPct;

  if (sand == null || silt == null || clay == null) return null;

  if (sand >= 70 && clay < 15) return "sableuse";
  if (sand >= 55 && silt >= 20 && clay < 20) return "sablo-limoneuse";
  if (silt >= 50 && clay < 20) return "limoneuse";
  if (clay >= 35) return "argileuse";
  if (clay >= 20 && sand >= 35) return "sablo-argileuse";
  if (clay >= 20 && silt >= 35) return "limono-argileuse";

  return "équilibrée";
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
    const soil = await fetchSoilSummary(latitude, longitude);
    const textureLabel = inferTextureLabel(soil);

    const conditionsExploitation = {
      tempMoyenne: climate.tempMoyenne,
      tempMinHivernale: climate.tempMinHivernale,
      precipitationsAnnuelles: climate.precipitationsAnnuelles,
      phSol: soil.phSol ?? 6.5,
    };

    const results = CROP_CATALOG.map((c) => {
      let infraPenalty = 0;
      if (c.infra?.needsSerre && !hasSerre) infraPenalty += 6;
      if (c.infra?.needsIrrigation && irrigationType === "aucune") {
        infraPenalty += 4;
      }

      let scoreSurface = 10;
      if (typeof surfaceHa === "number" && surfaceHa < c.surfaceMinHa) {
        scoreSurface = Math.max(
          0,
          Math.round((surfaceHa / c.surfaceMinHa) * 10)
        );
      }

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

      const scoreClimat = sTemp + sWinter + sPrecip;

      const sPh = scoreRange(
        soil.phSol,
        c.soil.ph.ideal[0],
        c.soil.ph.ideal[1],
        c.soil.ph.tol[0],
        c.soil.ph.tol[1],
        12
      );

      const sSand = scoreRange(
        soil.sandPct,
        c.soil.sandPct.ideal[0],
        c.soil.sandPct.ideal[1],
        c.soil.sandPct.tol[0],
        c.soil.sandPct.tol[1],
        8
      );

      const sSoc = scoreRange(
        soil.socPct,
        c.soil.socPct.ideal[0],
        c.soil.socPct.ideal[1],
        c.soil.socPct.tol[0],
        c.soil.socPct.tol[1],
        5
      );

      const scoreSol = sPh + sSand + sSoc;

      const scoreInfrastructure = Math.max(0, 10 - infraPenalty);

      let scoreDemande = c.demandScore15 ?? 10;
      if (objectifProduction === "transformation") {
        scoreDemande = clamp(scoreDemande + 1, 0, 15);
      }
      if (objectifProduction === "test_pilote") {
        scoreDemande = clamp(scoreDemande - 1, 0, 15);
      }

      const scoreTotal =
        scoreClimat +
        scoreSol +
        scoreSurface +
        scoreInfrastructure +
        scoreDemande;

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
        soil,
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
      soil: {
        ...soil,
        textureLabel,
      },
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