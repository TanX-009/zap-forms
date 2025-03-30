import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  status?: "error" | "success" | "neutral";
  className?: string;
}

export default function Message({
  children,
  status = "neutral",
  className = "",
}: TProps) {
  if (children && children !== "") {
    return (
      <p className={`${status} ${styles.message} ${className}`}>{children}</p>
    );
  }
  return <></>;
}
