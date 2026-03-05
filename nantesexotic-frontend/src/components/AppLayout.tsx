import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Button } from "./Button";
import { Separator } from "./Separator";
import styles from "./AppLayout.module.css";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Sprout size={24} />
            </div>
            <span className={styles.logoText}>NantesExotic</span>
          </Link>

          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/diagnostic"
              className={`${styles.navLink} ${
                location.pathname === "/diagnostic" ? styles.active : ""
              }`}
            >
              Diagnostic
            </Link>
          </nav>

          <div className={styles.actions}>
            <Button asChild variant="primary" size="sm">
              <Link to="/diagnostic">Lancer un diagnostic</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>NantesExotic</h3>
            <p className={styles.footerText}>
              Plateforme d’aide à la décision scientifique pour l'adaptation des
              cultures latino-américaines en climat tempéré.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>Liens utiles</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/diagnostic">Diagnostic</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>Sources de données</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
                  Open-Meteo API
                </a>
              </li>
              <li>
                <a href="https://soilgrids.org/" target="_blank" rel="noreferrer">
                  SoilGrids API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className={styles.separator} />

        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} NantesExotic. Tous droits réservés.</p>
          <p className={styles.disclaimer}>
            Avertissement : Cet outil fournit des estimations basées sur des
            modèles scientifiques. Les résultats sont indicatifs et ne
            remplacent pas une expertise agronomique terrain.
          </p>
        </div>
      </footer>
    </div>
  );
}