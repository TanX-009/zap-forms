import React, { ChangeEvent, InvalidEvent, ReactNode, useState } from "react";
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
  defaultValue: string[] | null;
  search?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxGroup({
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
  const [checkedValues, setCheckedValues] = useState<string[]>(
    defaultValue || [],
  );

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    setCheckedValues((prevValues) =>
      isChecked
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value),
    );

    onChange(event);
  };

  const sortedOptions = searchTerm
    ? sortBySearchTerm<TOption>(options, searchTerm, "label")
    : options;

  const handleValidation = (event: InvalidEvent<HTMLInputElement>) => {
    if (required && checkedValues.length === 0) {
      event.target.setCustomValidity(
        "Please tick at least one option to proceed.",
      );
    } else {
      event.target.setCustomValidity("");
    }
  };

  return (
    <div className={`${styles.checkboxGroup} ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      {search && (
        <Input
          type="text"
          name={"_" + name}
          placeholder={`Search ${name}...`}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      )}
      <div className={styles.checkboxOptions}>
        {sortedOptions.map((option, index) => (
          <label key={index} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={checkedValues.includes(option.value)}
              onChange={handleCheckboxChange}
              required={required && checkedValues.length === 0}
              onInvalid={handleValidation}
              className={"input"}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
