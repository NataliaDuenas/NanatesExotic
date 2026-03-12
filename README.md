# NantesExotic

> Outil d'aide à la décision pour l'identification de cultures latino-américaines adaptables au bassin nantais.

![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)

🔗 **Application en ligne :** [https://nantes-exotic.vercel.app](https://nantes-exotic.vercel.app)

---

## Contexte

Le changement climatique modifie progressivement les conditions agroclimatiques dans plusieurs régions d'Europe, notamment dans le bassin nantais. L'augmentation des températures et les évolutions des saisons culturales pourraient permettre l'introduction de certaines cultures d'origine subtropicale ou tropicale.

Dans le même temps, la France importe une grande quantité de produits agricoles provenant d'Amérique latine. Étudier la possibilité de cultiver certains de ces produits localement pourrait contribuer à diversifier la production agricole et à réduire partiellement la dépendance aux importations.

---

## Objectif

Le projet **NantesExotic** vise à analyser la faisabilité de cultiver un ensemble spécifique de plantes d'origine latino-américaine dans le bassin nantais, en fonction :

- du **climat** (températures, précipitations, risque de gel)
- du **sol** (pH, texture, carbone organique)
- des **conditions agronomiques** (surface, infrastructure, irrigation)

---

## Cultures étudiées

| Culture | Nom scientifique | Intérêt principal |
|---|---|---|
| Bananier | *Musa spp.* | Fruit à haute valeur ajoutée |
| Goyavier | *Psidium guajava* | Fort potentiel de transformation |
| Fruit de la passion | *Passiflora edulis* | Marché européen en croissance |
| Papayer | *Carica papaya* | Demande croissante en Europe |
| Acérolier | *Malpighia emarginata* | Richesse en vitamine C |
| Corossolier | *Annona spp.* | Niche haut de gamme |
| Manguier | *Mangifera indica* | Culture emblématique tropicale |

---

## Utilisateurs cibles

- Agriculteurs du bassin nantais
- Porteurs de projets de diversification agricole
- Acteurs institutionnels de l'innovation agronomique

---

## Fonctionnement de l'application

### 1️ Collecte des données de l'exploitation
L'agriculteur renseigne sa localisation, la surface disponible, le type d'irrigation et la présence éventuelle d'une serre.

### 2️ Analyse des conditions locales
L'application interroge automatiquement :
- **Open-Meteo** → données climatiques historiques sur 5 ans
- **SoilGrids (ISRIC)** → propriétés physico-chimiques du sol

### 3️ Scoring agronomique
Chaque culture est évaluée selon 5 piliers :

| Pilier | Points |
|---|---|
| 🌡️ Climat (température, gel, précipitations) | 40 pts |
| 🪱 Sol (pH, texture, carbone organique) | 25 pts |
| 📐 Surface disponible | 10 pts |
| 🏗️ Infrastructure (serre, irrigation) | 10 pts |
| 📈 Potentiel de marché européen | 15 pts |

### 4️ Recommandation
L'application génère un classement des 5 cultures les plus adaptées, avec pour chacune une justification détaillée et une fiche technique agricole.

---

## Architecture technique

```
NantesExotic/
├── nantesexotic-frontend/   # React 19 + Vite + TypeScript
│   └── src/
│       ├── pages/           # Home, Diagnostic, Résultats
│       ├── components/      # UI (Form, Input, Badge…)
│       └── helpers/         # Hooks (useCrops, useForm…)
│
└── nantesexotic-backend/    # Node.js + Express
    ├── server.js
    ├── routes/
    │   └── diagnostic.js    # Logique de scoring
    ├── catalog/
    │   └── crops.js         # Catalogue des 7 cultures
    └── public/
        └── crops/           # Images des cultures
```

---

## APIs utilisées

| API | Usage | Documentation |
|---|---|---|
| [Open-Meteo](https://open-meteo.com/) | Données climatiques historiques | Gratuite, sans clé |
| [SoilGrids ISRIC](https://soilgrids.org/) | Propriétés du sol | Gratuite, sans clé |

> ⚠️ En cas d'indisponibilité de SoilGrids, l'application utilise automatiquement des valeurs pédologiques typiques du bassin nantais.

---

## Déploiement

### Frontend → Vercel

1. Connecter le repo GitHub à [vercel.com](https://vercel.com)
2. Configurer :
   - **Root Directory :** `nantesexotic-frontend`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
3. Ajouter la variable d'environnement :
   ```
   VITE_API_URL=https://nanatesexotic.onrender.com
   ```

### Backend → Render

1. Créer un **Web Service** sur [render.com](https://render.com)
2. Configurer :
   - **Root Directory :** `nantesexotic-backend`
   - **Build Command :** `npm install`
   - **Start Command :** `node server.js`

> ⚠️ Le plan gratuit de Render met le service en veille après 15 min d'inactivité. Le premier chargement peut prendre 1-2 minutes.

---

## Installation locale

```bash
# Cloner le repo
git clone https://github.com/NataliaDuenas/NanatesExotic.git
cd NanatesExotic

# Backend
cd nantesexotic-backend
npm install
node server.js        # http://localhost:4000

# Frontend (dans un autre terminal)
cd nantesexotic-frontend
npm install
cp .env.example .env  # Ajouter VITE_API_URL=http://localhost:4000
npm run dev           # http://localhost:5173
```

---

## Auteurs
ALFEREZ CORDERO, Barbara Catalina
DUEÑAS SALAMANCA, Natalia
GÓMEZ ROSAS, Florencia
JAYAT IDABERRRI, Agustina
JAYAT IDABERRI, Belén
Projet d'innovation à l'**IMT Atlantique** — 2026
