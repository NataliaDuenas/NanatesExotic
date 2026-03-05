import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../../components/Button";
import { useCrops } from "../../helpers/useCrops";
import { AppLayout } from "../../components/AppLayout";
import {
  ThermometerSun,
  Sprout,
  Map,
  Warehouse,
  TrendingUp,
  ArrowRight,
  Database,
  CloudSun,
} from "lucide-react";
import styles from "./_index.module.css";

export default function LandingPage() {
  const { data: cropsData, isLoading } = useCrops();

    console.log("crops count:", cropsData?.crops?.length, cropsData?.crops);

  // ✅ Tus imágenes están en: public/crops/*.jpg
  // ✅ Map por ID (según tu catálogo)
  const cropImageById: Record<string, string> = {
    "1": "/crops/bananier.jpg",
    "2": "/crops/goyavier.jpg",
    "3": "/crops/passion.jpg",
    "4": "/crops/papayer.jpg",
    "5": "/crops/acerolier.jpg",
    "6": "/crops/corossolier.jpg",
    "7": "/crops/manguier.jpg",
  };

  return (
    <AppLayout>
      <>
        <Helmet>
          <title>Accueil | NantesExotic</title>
          <meta
            name="description"
            content="Identifiez les cultures latino-américaines viables dans votre exploitation nantaise grâce à notre outil d'analyse scientifique."
          />
        </Helmet>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Identifiez les cultures{" "}
                <span className={styles.highlight}>latino-américaines</span>{" "}
                viables dans votre exploitation
              </h1>
              <p className={styles.heroSubtitle}>
                Une approche scientifique pour diversifier votre production.
                Analysez la compatibilité de votre sol et de votre climat avec
                des espèces à haute valeur ajoutée.
              </p>
              <div className={styles.heroActions}>
                <Button asChild size="lg" className={styles.ctaButton}>
                  <Link to="/diagnostic">
                    Lancer un diagnostic <ArrowRight size={20} />
                  </Link>
                </Button>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualCard}>
                <div className={styles.visualIcon}>🌱</div>
                <div className={styles.visualLabel}>Analyse de viabilité</div>
                <div className={styles.visualScore}>94%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Méthodologie Scientifique</h2>
              <p className={styles.sectionSubtitle}>
                Notre algorithme évalue la faisabilité selon 5 piliers
                agronomiques fondamentaux.
              </p>
            </div>

            <div className={styles.grid5}>
              <MethodologyCard
                icon={<ThermometerSun size={32} />}
                title="Climat"
                score="40 pts"
                description="Températures, gel, précipitations et saisonnalité."
              />
              <MethodologyCard
                icon={<Sprout size={32} />}
                title="Sol"
                score="25 pts"
                description="pH, texture, drainage et carbone organique."
              />
              <MethodologyCard
                icon={<Map size={32} />}
                title="Surface"
                score="10 pts"
                description="Surface disponible minimale requise par culture."
              />
              <MethodologyCard
                icon={<Warehouse size={32} />}
                title="Infrastructure"
                score="10 pts"
                description="Nécessité de serres ou systèmes d'irrigation."
              />
              <MethodologyCard
                icon={<TrendingUp size={32} />}
                title="Demande"
                score="15 pts"
                description="Potentiel économique sur le marché européen."
              />
            </div>
          </div>
        </section>

        {/* Crops Section */}
        <section className={`${styles.section} ${styles.bgSurface}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Cultures Étudiées</h2>
              <p className={styles.sectionSubtitle}>
                Une sélection d'espèces prometteuses pour le bassin nantais.
              </p>
            </div>

            {isLoading ? (
              <div className={styles.loading}>Chargement des cultures...</div>
            ) : (
              <div className={styles.cropsGrid}>
                {cropsData?.crops?.map((crop: any) => (
                  <div key={crop.id} className={styles.cropItem}>
                    <img
                      src={
                        crop.imageUrl
                          ? `http://localhost:4000${crop.imageUrl}`
                          : "http://localhost:4000/crops/placeholder.jpg"
                      }
                      alt={crop.name}
                      onError={(e) => {
                        e.currentTarget.src = "http://localhost:4000/crops/placeholder.jpg";
                      }}
                    />
                    <span className={styles.cropName}>{crop.name}</span>
                    <span className={styles.cropScience}>
                      {crop.scientificName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Data Sources Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sources de Données Fiables</h2>
              <p className={styles.sectionSubtitle}>
                Nous agrégeons des données climatiques et pédologiques précises
                via des API reconnues.
              </p>
            </div>

            <div className={styles.sourcesGrid}>
              <div className={styles.sourceCard}>
                <CloudSun size={40} className={styles.sourceIcon} />
                <h3>Open-Meteo</h3>
                <p>
                  Données météorologiques historiques et prévisionnelles haute
                  résolution.
                </p>
              </div>
              <div className={styles.sourceCard}>
                <Database size={40} className={styles.sourceIcon} />
                <h3>SoilGrids</h3>
                <p>
                  Système global d'information sur les sols fournissant des
                  propriétés physico-chimiques.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    </AppLayout>
  );
}

function MethodologyCard({
  icon,
  title,
  score,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  score: string;
  description: string;
}) {
  return (
    <div className={styles.methodCard}>
      <div className={styles.methodIconWrapper}>{icon}</div>
      <h3 className={styles.methodTitle}>{title}</h3>
      <div className={styles.methodScore}>Max: {score}</div>
      <p className={styles.methodDesc}>{description}</p>
    </div>
  );
}