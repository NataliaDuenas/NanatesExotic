export type NiveauRisque = "faible" | "moyen" | "eleve";
export type ModeConseille = "plein_champ" | "serre" | "serre_chauffee";

export type CropResult = {
  id: string;
  name: string;
  scientificName?: string;

  // ✅ lo nuevo
  imageUrl?: string;

  // scoring
  scoreTotal: number;
  scoreClimat: number;
  scoreSol: number;
  scoreSurface: number;
  scoreInfrastructure: number;
  scoreDemande: number;

  // advice / text
  niveauRisque: NiveauRisque;
  modeConseille: ModeConseille;
  justification: string;
  cultureGuide: string;
  phytosanitaryRisks: string;
  substitutionPotential: string;
};

export type DiagnosticOutput = {
  conditionsExploitation: {
    tempMoyenne: number;
    tempMinHivernale: number;
    precipitationsAnnuelles: number;
    phSol: number;
  };
  results: CropResult[];
};