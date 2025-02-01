import React from "react";
import styles from "./styles.module.css";

interface TProps {
  centerStage?: boolean;
}

export default function Loading({ centerStage = false }: TProps) {
  return (
    <div
      className={`${styles.loading} ${centerStage ? styles.centerStage : ""}`}
    >
      <span />
      <span />
      <span />
    </div>
  );
}
