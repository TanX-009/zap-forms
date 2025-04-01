import React from "react";
import styles from "./styles.module.css";
import { FaStarOfLife } from "react-icons/fa";

export default function RequiredStar() {
  return (
    <span className={styles.star}>
      {" "}
      <FaStarOfLife />
    </span>
  );
}
