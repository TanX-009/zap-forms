import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface TProps {
  name: string;
  label?: ReactNode | null;
  type?: "text" | "email" | "password" | "number";
  defaultValue?: string | number;
  required?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  name,
  label = null,
  type = "text",
  defaultValue = undefined,
  required = false,
  className = "",
  placeholder = "",
  onChange = () => {},
}: TProps) {
  return (
    <div className={`${styles.input} ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        className={"input"}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
