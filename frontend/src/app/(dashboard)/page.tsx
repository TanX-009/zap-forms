import Link from "next/link";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href={"/"}></Link>
    </div>
  );
}
