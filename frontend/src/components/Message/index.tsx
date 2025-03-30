import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  status?: "error" | "success" | "neutral";
}

export default function Message({ children, status = "neutral" }: TProps) {
  if (children && children !== "") {
    return <p className={`${status} ${styles.message}`}>{children}</p>;
  }
  return <></>;
}
