import React from "react";
import styles from "./styles.module.css";

interface TProps {
  name: string;
  label?: string | null;
  type?: "text" | "email" | "password";
  defaultValue?: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  name,
  label = null,
  type = "text",
  defaultValue = "",
  required = false,
  className = "",
}: TProps) {
  return (
    <div className={styles.input}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        className={"input " + className}
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}
