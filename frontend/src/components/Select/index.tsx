import React, { ChangeEvent, ReactNode } from "react";
import styles from "./styles.module.css";

interface TPropsBase {
  name: string;
  options: { value: string; label: string }[];
  label?: ReactNode | null;
  required?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

type TProps =
  | (TPropsBase & { selected?: number | null; defaultValue?: never }) // selected allowed, defaultValue not
  | (TPropsBase & { defaultValue: string | null; selected?: never }); // defaultValue allowed, selected not

export default function Select({
  name,
  options,
  selected = null,
  defaultValue = null,
  label = null,
  required = false,
  className = "",
  onChange = () => {},
}: TProps) {
  let _defaultValue = "";
  // if selected is passed then set the default value to selected value
  if ((selected || selected === 0) && !defaultValue) {
    _defaultValue = options[selected].value;
    // if default value is directly passed set default to it
  } else if (defaultValue && !selected) {
    _defaultValue = defaultValue;
  } else {
    _defaultValue = "";
  }
  return (
    <div className={`${styles.select} ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <select
        className={"input"}
        name={name}
        id={name}
        defaultValue={_defaultValue}
        required={required}
        onChange={onChange}
      >
        <option value="" disabled>
          Select {name}...
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
