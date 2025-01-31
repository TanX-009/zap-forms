import Button from "@/components/Button";
import { TQuestion } from "@/types/survey";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

interface TProps {
  question: TQuestion;
  setUpdateQuestion: Dispatch<
    SetStateAction<{ isVisible: boolean; question: TQuestion }>
  >;
}

export default function QuestionCard({ question, setUpdateQuestion }: TProps) {
  let questionType = question.type.replace("-", " ");
  questionType = questionType.charAt(0).toUpperCase() + questionType.slice(1);
  return (
    <div className={"panel " + styles.questionCard}>
      <div className={styles.bar}>
        <h3>{question.text}</h3>
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setUpdateQuestion((val) => ({
                ...val,
                question: question,
                isVisible: true,
              }));
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      {question.type === "multiple-choice" && question.options ? (
        <div className={styles.options}>
          <b>Options: </b>
          {question.options.map((option, index) => (
            <Button key={index}>{option.text}</Button>
          ))}
        </div>
      ) : null}
      <p>
        <b>Type: </b>
        {questionType}
      </p>
      <p>
        <b>Required: </b>
        {question.required ? "Yes" : "No"}
      </p>
    </div>
  );
}
