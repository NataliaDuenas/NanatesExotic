export const CROP_CATALOG = [
  {
    id: "bananier",
    name: "Bananier",
    scientificName: "Musa spp.",
    imageUrl: "/crops/bananier.jpg",
    climate: {
      tmean: { ideal: [22, 35], tol: [15, 40] },
      winterMin: { ideal: [2, 12], tol: [-1, 15] },
      precip: { ideal: [1200, 2500], tol: [800, 3000] },
    },
    soil: {
      ph: { ideal: [5.5, 7.0], tol: [5.0, 7.5] },
      sandPct: { ideal: [30, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.5,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 15,
    guides: {
      cultureGuide:
        "Plantation en sol riche et bien drainé. Température idéale 25-30°C. Arrosage régulier et abondant. Fertilisation mensuelle N-K. Récolte 9-12 mois après plantation. Protection hivernale obligatoire en zone nantaise.",
      phytosanitaryRisks:
        "Cercosporiose noire (Mycosphaerella fijiensis), charançon du bananier, nématodes racinaires. Surveillance régulière recommandée.",
      substitutionPotential:
        "Fort potentiel : la France importe >600 000 t/an de bananes. Production locale sous serre = circuit ultra-court.",
    },
  },

  {
    id: "goyavier",
    name: "Goyavier",
    scientificName: "Psidium guajava",
    imageUrl: "/crops/goyavier.jpg",
    climate: {
      tmean: { ideal: [20, 33], tol: [12, 38] },
      winterMin: { ideal: [-2, 10], tol: [-4, 15] },
      precip: { ideal: [800, 1500], tol: [400, 2000] },
    },
    soil: {
      ph: { ideal: [5.0, 7.0], tol: [4.5, 7.8] },
      sandPct: { ideal: [25, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.3,
    infra: { needsIrrigation: false, needsSerre: true },
    demandScore15: 10,
    guides: {
      cultureGuide:
        "Plantation au printemps en sol bien drainé. Taille de formation les 2 premières années. Arrosage modéré, supporte de courtes sécheresses. Fructification dès la 2e-3e année. Peut supporter de brèves gelées légères.",
      phytosanitaryRisks:
        "Mouche des fruits (Anastrepha spp.), anthracnose, rouille du goyavier. Traitement biologique possible.",
      substitutionPotential:
        "Moyen : marché de niche en croissance pour les jus et purées de goyave bio. Demande en hausse dans la restauration.",
    },
  },

  {
    id: "passion",
    name: "Fruit de la passion",
    scientificName: "Passiflora edulis",
    imageUrl: "/crops/passion.jpg",
    climate: {
      tmean: { ideal: [18, 32], tol: [12, 36] },
      winterMin: { ideal: [-1, 10], tol: [-3, 15] },
      precip: { ideal: [900, 1700], tol: [500, 2300] },
    },
    soil: {
      ph: { ideal: [6.0, 7.5], tol: [5.2, 8.0] },
      sandPct: { ideal: [25, 65], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.2,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 14,
    guides: {
      cultureGuide:
        "Palissage sur fil ou treillage indispensable. Plantation au printemps. Pollinisation manuelle parfois nécessaire sous serre. Sol riche et bien drainé. Récolte 6-8 mois après floraison. Renouvellement tous les 4-5 ans.",
      phytosanitaryRisks:
        "Virus du bois dur (PWV), fusariose, mouches des fruits. Rotation culturale recommandée.",
      substitutionPotential:
        "Élevé : la France importe la quasi-totalité de sa consommation. Prix de vente élevé (8-15 €/kg). Forte demande restauration et industrie des boissons.",
    },
  },

  {
    id: "papayer",
    name: "Papayer",
    scientificName: "Carica papaya",
    imageUrl: "/crops/papayer.jpg",
    climate: {
      tmean: { ideal: [22, 35], tol: [16, 38] },
      winterMin: { ideal: [1, 12], tol: [0, 15] },
      precip: { ideal: [1000, 2000], tol: [600, 2600] },
    },
    soil: {
      ph: { ideal: [5.5, 7.0], tol: [5.0, 7.8] },
      sandPct: { ideal: [30, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.3,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 9,
    guides: {
      cultureGuide:
        "Sol léger, bien drainé, riche en matière organique. Ne supporte absolument pas l'engorgement. Serre chauffée indispensable en hiver. Fructification dès 10-12 mois. Sensible au vent.",
      phytosanitaryRisks:
        "Virus de la mosaïque (PRSV), oïdium, mouches blanches. Variétés résistantes recommandées.",
      substitutionPotential:
        "Moyen : marché stable mais dominé par les importations brésiliennes. Créneau bio et local à développer.",
    },
  },

  {
    id: "acerolier",
    name: "Acérolier",
    scientificName: "Malpighia emarginata",
    imageUrl: "/crops/acerolier.jpg",
    climate: {
      tmean: { ideal: [22, 34], tol: [16, 38] },
      winterMin: { ideal: [0, 12], tol: [-1, 15] },
      precip: { ideal: [1000, 1800], tol: [600, 2400] },
    },
    soil: {
      ph: { ideal: [5.5, 6.5], tol: [5.0, 7.2] },
      sandPct: { ideal: [25, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.2,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 15,
    guides: {
      cultureGuide:
        "Plantation en pot ou pleine terre sous serre. Sol acide à légèrement acide. Taille régulière pour maintenir un port compact. Fructification 2-3 fois par an en conditions optimales.",
      phytosanitaryRisks:
        "Cochenilles, pucerons, anthracnose. Peu de maladies graves en culture sous serre contrôlée.",
      substitutionPotential:
        "Très fort : le marché européen des superfruits explose. L'acérola bio français serait un produit premium à très forte valeur ajoutée.",
    },
  },

  {
    id: "corossolier",
    name: "Corossolier",
    scientificName: "Annona spp.",
    imageUrl: "/crops/corossolier.jpg",
    climate: {
      tmean: { ideal: [20, 32], tol: [16, 36] },
      winterMin: { ideal: [1, 12], tol: [0, 15] },
      precip: { ideal: [1000, 1800], tol: [600, 2400] },
    },
    soil: {
      ph: { ideal: [5.5, 6.5], tol: [5.0, 7.2] },
      sandPct: { ideal: [25, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.3,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 11,
    guides: {
      cultureGuide:
        "Culture strictement sous serre en zone nantaise. Sol riche et bien drainé. Croissance lente les 2 premières années. Pollinisation manuelle souvent nécessaire. Patience requise : fructification à partir de 3-4 ans.",
      phytosanitaryRisks:
        "Cochenilles farineuses, foreurs du tronc, anthracnose des fruits. Surveillance phytosanitaire rigoureuse.",
      substitutionPotential:
        "Moyen-fort : marché de niche en forte croissance. Très recherché par les communautés caribéennes et latino-américaines en Europe.",
    },
  },

  {
    id: "manguier",
    name: "Manguier",
    scientificName: "Mangifera indica",
    imageUrl: "/crops/manguier.jpg",
    climate: {
      tmean: { ideal: [24, 36], tol: [18, 40] },
      winterMin: { ideal: [1, 12], tol: [0, 15] },
      precip: { ideal: [800, 1500], tol: [400, 2000] },
    },
    soil: {
      ph: { ideal: [5.5, 7.5], tol: [5.0, 8.0] },
      sandPct: { ideal: [25, 70], tol: [10, 90] },
      socPct: { ideal: [1.0, 6.0], tol: [0.2, 10.0] },
    },
    surfaceMinHa: 0.5,
    infra: { needsIrrigation: true, needsSerre: true },
    demandScore15: 14,
    guides: {
      cultureGuide:
        "Variétés naines recommandées (Irwin, Cogshall). Serre haute indispensable. Période de stress hydrique nécessaire pour induire la floraison. Greffage sur porte-greffe nanisant. Fructification 3-5 ans après greffe.",
      phytosanitaryRisks:
        "Anthracnose, mouche des fruits, oïdium, bactériose. Programme de protection intégrée indispensable.",
      substitutionPotential:
        "Fort : la France importe >120 000 t/an de mangues. Production locale = argument marketing très fort. Prix premium possible.",
    },
  },
];