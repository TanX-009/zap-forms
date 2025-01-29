import React from "react";
import styles from "./styles.module.css";

interface TProps {
  name: string;
  options: { value: string; label: string }[];
  selected?: number | null;
  label?: string | null;
}

export default function Select({
  name,
  options,
  selected = null,
  label = null,
}: TProps) {
  return (
    <div className={styles.select}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <select
        className={"input"}
        name={name}
        id={name}
        defaultValue={selected ? options[selected].value : ""}
        required={true}
      >
        {!selected ? (
          <option value="" disabled>
            Select {name}...
          </option>
        ) : null}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
}
