export type NiveauRisque = "faible" | "moyen" | "eleve";
export type ModeConseille = "plein_champ" | "serre" | "serre_chauffee";

export type CropResult = {
  id: string;
  name: string;
  scientificName?: string;
  imageUrl?: string;

  scoreTotal: number;
  scoreClimat: number;
  scoreSol: number;
  scoreSurface: number;
  scoreInfrastructure: number;
  scoreDemande: number;

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
  soil: {
    phSol: number | null;
    socPct: number | null;
    sandPct: number | null;
    siltPct: number | null;
    clayPct: number | null;
    textureLabel?: string | null;
  };
  results: CropResult[];
};