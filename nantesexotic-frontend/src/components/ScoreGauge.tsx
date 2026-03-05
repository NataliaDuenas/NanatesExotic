import React from "react";
import styles from "./ScoreGauge.module.css";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreGauge({
  score,
  size = 80,
  strokeWidth = 8,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let color = "var(--error)"; // < 50
  if (score >= 70) color = "var(--success)";
  else if (score >= 50) color = "var(--warning)";

  return (
    <div className={styles.gaugeContainer} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.gauge}
      >
        {/* Background Circle */}
        <circle
          className={styles.gaugeBackground}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          className={styles.gaugeProgress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.scoreText}>
        <span className={styles.scoreValue} style={{ color }}>
          {score}
        </span>
        <span className={styles.scoreLabel}>/100</span>
      </div>
    </div>
  );
}