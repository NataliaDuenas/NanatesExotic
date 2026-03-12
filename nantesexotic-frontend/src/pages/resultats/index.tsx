import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Thermometer, CloudRain, FlaskConical, Map} from "lucide-react";

import type { DiagnosticOutput } from "../../types/diagnostic";
import { AppLayout } from "../../components/AppLayout";
import { Button } from "../../components/Button";
import { CropCard } from "../../components/CropCard";
import styles from "./resultats.module.css";

export default function ResultatsPage() {
  const location = useLocation();
  const state = location.state as { results: DiagnosticOutput } | null;

  if (!state?.results) {
    return <Navigate to="/diagnostic" replace />;
  }

  const { results, conditionsExploitation, soil } = state.results;

  return (
    <AppLayout>
      <Helmet>
        <title>Résultats | NantesExotic</title>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.backLinkWrapper}>
          <Link to="/diagnostic" className={styles.backLink}>
            <ArrowLeft size={16} /> Retour au diagnostic
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Résultats de l&apos;analyse</h1>
          <p className={styles.subtitle}>
            Voici les cultures les plus adaptées à votre profil pédoclimatique
            parmi notre catalogue de plantes latino-américaines.
          </p>
        </div>

        {/* Conditions */}
        <div className={styles.conditionsCard}>
          <h2 className={styles.conditionsTitle}>
            Conditions de votre exploitation
          </h2>

          <div className={styles.conditionsGrid}>
            <div className={styles.conditionItem}>
              <div className={styles.conditionIcon}>
                <Thermometer />
              </div>
              <div className={styles.conditionContent}>
                <span className={styles.conditionLabel}>Température Moyenne</span>
                <span className={styles.conditionValue}>
                  {conditionsExploitation.tempMoyenne.toFixed(1)}°C
                </span>
              </div>
            </div>

            <div className={styles.conditionItem}>
              <div className={styles.conditionIcon}>
                <Thermometer />
              </div>
              <div className={styles.conditionContent}>
                <span className={styles.conditionLabel}>Min. Hivernale</span>
                <span className={styles.conditionValue}>
                  {conditionsExploitation.tempMinHivernale.toFixed(1)}°C
                </span>
              </div>
            </div>

            <div className={styles.conditionItem}>
              <div className={styles.conditionIcon}>
                <CloudRain />
              </div>
              <div className={styles.conditionContent}>
                <span className={styles.conditionLabel}>Précipitations/an</span>
                <span className={styles.conditionValue}>
                  {Math.round(conditionsExploitation.precipitationsAnnuelles)}mm
                </span>
              </div>
            </div>

            <div className={styles.conditionItem}>
              <div className={styles.conditionIcon}>
                <FlaskConical />
              </div>
              <div className={styles.conditionContent}>
                <span className={styles.conditionLabel}>pH Sol</span>
                <span className={styles.conditionValue}>
                  {conditionsExploitation.phSol.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.conditionsCard}>
            <h2 className={styles.conditionsTitle}>Caractéristiques du sol</h2>

            <div className={styles.conditionsGrid}>
              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <FlaskConical />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>pH du sol</span>
                  <span className={styles.conditionValue}>
                    {soil?.phSol != null ? soil.phSol.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <Map />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>Sable</span>
                  <span className={styles.conditionValue}>
                    {soil?.sandPct != null ? `${soil.sandPct.toFixed(0)}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <Map />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>Argile</span>
                  <span className={styles.conditionValue}>
                    {soil?.clayPct != null ? `${soil.clayPct.toFixed(0)}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <Map />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>Limon</span>
                  <span className={styles.conditionValue}>
                    {soil?.siltPct != null ? `${soil.siltPct.toFixed(0)}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <FlaskConical />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>Carbone organique</span>
                  <span className={styles.conditionValue}>
                    {soil?.socPct != null ? `${soil.socPct.toFixed(1)}%` : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.conditionItem}>
                <div className={styles.conditionIcon}>
                  <Map />
                </div>
                <div className={styles.conditionContent}>
                  <span className={styles.conditionLabel}>Texture dominante</span>
                  <span className={styles.conditionValue}>
                    {soil?.textureLabel ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <section className={styles.resultsSection}>
          <h2 className={styles.sectionHeading}>Vos cultures les plus adaptées</h2>
          <div className={styles.cardsList}>
            {results.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        </section>

        {/* Commercial */}
        <section className={styles.commercialSection}>
          <div className={styles.commercialCard}>
            <h2 className={styles.commercialTitle}>Où acheter les plants ?</h2>
            <p className={styles.commercialText}>
              Pour garantir la qualité et l&apos;authenticité variétale, nous
              recommandons notre partenaire pépiniériste spécialisé.
            </p>

            <Button asChild variant="secondary">
              <a
                href="https://www.lamaisondubanier.com/"
                target="_blank"
                rel="noreferrer"
              >
                Visiter La Maison du Bananier
              </a>
            </Button>
          </div>

          <div className={styles.commercialCard}>
            <h2 className={styles.commercialTitle}>Débouchés potentiels</h2>
            <p className={styles.commercialText}>
              Connectez-vous avec les acteurs locaux pour valoriser votre production.
            </p>
            <ul className={styles.marketList}>
              <li>🛒 Grossistes fruits exotiques (MIN de Nantes)</li>
              <li>🏭 Transformateurs (Confitures, jus, glaces artisanales)</li>
              <li>🏪 Magasins spécialisés et épiceries fines</li>
            </ul>
          </div>
        </section>

        <div className={styles.actionsFooter}>
          <Button asChild size="lg" variant="outline">
            <Link to="/diagnostic">Lancer un nouveau diagnostic</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}