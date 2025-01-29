import React from "react";
import styles from "./styles.module.css";

interface TPropsBase {
  name: string;
  options: { value: string; label: string }[];
  label?: string | null;
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
}: TProps) {
  let _defaultValue = "";
  if (selected && !defaultValue) {
    _defaultValue = options[selected].value;
  } else if (defaultValue && !selected) {
    _defaultValue = defaultValue;
  } else {
    _defaultValue = "";
  }
  return (
    <div className={styles.select}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <select
        className={"input"}
        name={name}
        id={name}
        defaultValue={_defaultValue}
        required={true}
      >
        <option value="" disabled>
          Select {name}...
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
}
