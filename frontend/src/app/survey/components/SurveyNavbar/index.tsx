"use client";

import { TQuestion } from "@/types/survey";
import styles from "./styles.module.css";
import Logo from "@/components/Logo";
import useNetworkStatus from "@/hooks/networkStatus";

interface TProps {
  title: string | null;
  questions: TQuestion[];
  current: number;
}

export default function SurveyNavbar({ title, questions, current }: TProps) {
  const isOnline = useNetworkStatus();

  return (
    <div className={styles.navbar}>
      <Logo multiplier={36} />
      {isOnline ? "You are online" : "You are offline"}
      <p>
        <b>Question: </b>
        <span className={styles.current}>{current}</span>
        <span className={styles.total}>/{questions.length}</span>
      </p>
      <h1>{title}</h1>
    </div>
  );
}
