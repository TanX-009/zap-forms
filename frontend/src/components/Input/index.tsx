import React from "react";
import styles from "./styles.module.css";

interface TProps {
  name: string;
  label?: string | null;
  type?: "text" | "email" | "password";
  required?: boolean;
}

export default function Input({
  name,
  label = null,
  type = "text",
  required = false,
}: TProps) {
  return (
    <div className={styles.input}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        className={"input"}
        type={type}
        id={name}
        name={name}
        required={required}
      />
    </div>
  );
}
