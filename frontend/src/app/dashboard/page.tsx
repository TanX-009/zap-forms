"use client";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link className={"loClick"} href={"/dashboard/users"}>
        Users
      </Link>
    </div>
  );
}
