import React, { ChangeEvent, ReactNode, useState } from "react";
import styles from "./styles.module.css";
import Input from "../Input";
import sortBySearchTerm from "@/systems/sortBySearchTerm";

interface TOption {
  value: string;
  label: string;
}

interface TProps {
  name: string;
  options: TOption[];
  label?: ReactNode | null;
  required?: boolean;
  className?: string;
  search?: boolean;
  defaultValue?: string | null;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioGroup({
  name,
  options,
  defaultValue = null,
  label = null,
  required = false,
  className = "",
  search = false,
  onChange = () => {},
}: TProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const sortedOptions = searchTerm
    ? sortBySearchTerm<TOption>(options, searchTerm, "label")
    : options;

  return (
    <div className={`${styles.radioGroup} ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      {search && (
        <Input
          type="text"
          name={"options"}
          placeholder={`Search ${name}...`}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      )}
      <div className={styles.radioOptions}>
        {sortedOptions.map((option, index) => (
          <label key={index} className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
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
