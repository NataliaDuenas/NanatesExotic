import express from "express";
import { CROP_CATALOG } from "../catalog/crops.js";

const router = express.Router();

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

    const conditionsExploitation = {
      tempMoyenne: 13.5,
      tempMinHivernale: 1.0,
      precipitationsAnnuelles: 850,
      phSol: 6.5,
    };

    const results = CROP_CATALOG.map((c) => {
      let infraPenalty = 0;
      if (c.infra?.needsSerre && !hasSerre) infraPenalty += 10;
      if (c.infra?.needsIrrigation && irrigationType === "aucune") infraPenalty += 5;

      let scoreSurface = 10;
      if (typeof surfaceHa === "number" && surfaceHa < c.surfaceMinHa) {
        scoreSurface = Math.max(0, Math.round((surfaceHa / c.surfaceMinHa) * 10));
      }

      const scoreClimat = 25; // /40 placeholder
      const scoreSol = 16; // /25 placeholder
      const scoreInfrastructure = Math.max(0, 10 - infraPenalty); // /10
      const scoreDemande = c.demandScore15 ?? 10; // /15

      const scoreTotal =
        scoreClimat + scoreSol + scoreSurface + scoreInfrastructure + scoreDemande;

      const niveauRisque =
        scoreTotal >= 70 ? "faible" : scoreTotal >= 50 ? "moyen" : "eleve";

      const modeConseille = c.infra?.needsSerre
        ? hasSerre
          ? "serre"
          : "serre_chauffee"
        : "plein_champ";

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

        justification: "Analyse MVP (placeholder). Prochaine étape : Open-Meteo + SoilGrids.",
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