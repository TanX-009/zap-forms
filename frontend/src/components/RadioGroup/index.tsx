import React, { ChangeEvent, ReactNode, useState } from "react";
import styles from "./styles.module.css";
import Input from "../Input";

interface TPropsBase {
  name: string;
  options: { value: string; label: string }[];
  label?: ReactNode | null;
  required?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

type TProps =
  | (TPropsBase & { selected?: number | null; defaultValue?: never })
  | (TPropsBase & { defaultValue: string | null; selected?: never });

export default function RadioGroup({
  name,
  options,
  selected = null,
  defaultValue = null,
  label = null,
  required = false,
  className = "",
  onChange = () => {},
}: TProps) {
  const [search, setSearch] = useState("");

  let _defaultValue = "";
  if ((selected || selected === 0) && !defaultValue) {
    _defaultValue = options[selected].value;
  } else if (defaultValue && !selected) {
    _defaultValue = defaultValue;
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`${styles.radioGroup} ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <Input
        type="text"
        name="name"
        placeholder={`Search ${name}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.radioOptions}>
        {filteredOptions.map((option, index) => (
          <label key={index} className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={_defaultValue === option.value}
              required={required}
              onChange={onChange}
              className={"input"}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
