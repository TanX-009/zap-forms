import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import Button from "../Button";

interface TProps {
  current: string;
  setter: Dispatch<SetStateAction<string>>;
  tabs: string[];
}

export default function Tabs({ current, setter, tabs }: TProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <Button
          key={index}
          onClick={() => setter(tab)}
          variant={current === tab ? "hiClick" : "loClick"}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
