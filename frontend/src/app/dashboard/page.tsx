"use client";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      Home
      <Link href={"/dashboard/users"}>Users</Link>
    </div>
  );
}
