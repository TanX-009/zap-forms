import React, { FormEvent, ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  children: ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export default function Form({ children, onSubmit, className = "" }: TProps) {
  return (
    <form className={`${styles.form} ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
