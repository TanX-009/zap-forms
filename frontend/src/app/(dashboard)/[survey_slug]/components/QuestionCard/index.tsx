import Button from "@/components/Button";
import { TQuestion } from "@/types/survey";
import React from "react";
import styles from "./styles.module.css";

interface TProps {
  question: TQuestion;
}

export default function QuestionCard({ question }: TProps) {
  let questionType = question.type.replace("-", " ");
  questionType = questionType.charAt(0).toUpperCase() + questionType.slice(1);
  return (
    <div className={"panel " + styles.questionCard}>
      <div className={styles.bar}>
        <h3>{question.text}</h3>
        <Button>Edit</Button>
      </div>
      <p>
        <b>Type: </b>
        {questionType}
      </p>
      {question.type === "multiple-choice" && question.options ? (
        <div className={styles.options}>
          <b>Options: </b>
          {question.options.map((option, index) => (
            <Button key={index}>{option.text}</Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
