import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  icon?: ReactNode | null;
}

export default function Error({ children, icon = null }: TProps) {
  return (
    <div className={styles.error}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h2>{children}</h2>
    </div>
  );
}
