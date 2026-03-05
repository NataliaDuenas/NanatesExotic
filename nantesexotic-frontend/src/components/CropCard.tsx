import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { ScoreGauge } from "./ScoreGauge";
import { Separator } from "./Separator";
import type { CropResult } from "../types/diagnostic";
import { Sprout, Warehouse, ThermometerSun, Droplets, Map } from "lucide-react";
import styles from "./CropCard.module.css";


interface CropCardProps {
  crop: CropResult;
}

export function CropCard({ crop }: CropCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.mainInfo}>
          <div className={styles.imageWrap}>
            <img
                src={crop.imageUrl || "/crops/placeholder.jpg"}
                alt={crop.name}
                className={styles.image}
                loading="lazy"
            />
            </div>
          <div>
            <h3 className={styles.cropName}>{crop.name}</h3>
            <p className={styles.scientificName}>{crop.scientificName}</p>
            <div className={styles.badges}>
              <Badge
                variant={
                  crop.niveauRisque === "faible"
                    ? "success"
                    : crop.niveauRisque === "moyen"
                      ? "warning"
                      : "destructive"
                }
              >
                Risque {crop.niveauRisque}
              </Badge>
              <Badge variant="outline">
                {crop.modeConseille === "plein_champ"
                  ? "Plein champ"
                  : crop.modeConseille === "serre"
                    ? "Serre froide"
                    : "Serre chauffée"}
              </Badge>
            </div>
          </div>
        </div>
        <div className={styles.scoreContainer}>
          <ScoreGauge score={crop.scoreTotal} />
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.justification}>{crop.justification}</p>

        <div className={styles.scoresGrid}>
          <ScoreRow
            label="Climat"
            score={crop.scoreClimat}
            max={40}
            icon={<ThermometerSun size={14} />}
          />
          <ScoreRow
            label="Sol"
            score={crop.scoreSol}
            max={25}
            icon={<Sprout size={14} />}
          />
          <ScoreRow
            label="Surface"
            score={crop.scoreSurface}
            max={10}
            icon={<Map size={14} />}
          />
          <ScoreRow
            label="Infrastructure"
            score={crop.scoreInfrastructure}
            max={10}
            icon={<Warehouse size={14} />}
          />
          <ScoreRow
            label="Demande"
            score={crop.scoreDemande}
            max={15}
            icon={<Droplets size={14} />}
          />
        </div>

        <Separator className={styles.separator} />

        <Accordion type="single" collapsible className={styles.accordion}>
          <AccordionItem value="guide">
            <AccordionTrigger>Fiche technique détaillée</AccordionTrigger>
            <AccordionContent>
              <div className={styles.accordionContent}>{crop.cultureGuide}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="risks">
            <AccordionTrigger>Risques phytosanitaires</AccordionTrigger>
            <AccordionContent>
              <div className={styles.accordionContent}>
                {crop.phytosanitaryRisks}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="substitution">
            <AccordionTrigger>Potentiel de substitution</AccordionTrigger>
            <AccordionContent>
              <div className={styles.accordionContent}>
                {crop.substitutionPotential}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  score,
  max,
  icon,
}: {
  label: string;
  score: number;
  max: number;
  icon: React.ReactNode;
}) {
  const percentage = (score / max) * 100;
  return (
    <div className={styles.scoreRow}>
      <div className={styles.scoreLabel}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={styles.scoreBarContainer}>
        <Progress value={percentage} className={styles.miniProgress} />
      </div>
      <div className={styles.scoreValue}>
        {score}/{max}
      </div>
    </div>
  );
}