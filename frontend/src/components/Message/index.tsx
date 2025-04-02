import React, { ReactNode } from "react";
import styles from "./styles.module.css";

export interface TMessage {
  value: string;
  status: "error" | "success" | "neutral";
}

interface TProps {
  children: ReactNode;
  status?: TMessage["status"];
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
