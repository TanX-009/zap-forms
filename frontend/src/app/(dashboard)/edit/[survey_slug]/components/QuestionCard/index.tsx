import Button from "@/components/Button";
import { TQuestion } from "@/types/survey";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import { MdEdit } from "react-icons/md";

interface TProps {
  index: number;
  question: TQuestion;
  setQuestions: Dispatch<SetStateAction<TQuestion[] | null>>;
  setUpdateQuestion: Dispatch<
    SetStateAction<{ isVisible: boolean; question: TQuestion }>
  >;
  isEditingSequence: boolean;
}

export default function QuestionCard({
  index,
  question,
  setQuestions,
  setUpdateQuestion,
  isEditingSequence,
}: TProps) {
  let questionType = question.type.replace("-", " ");
  questionType = questionType.charAt(0).toUpperCase() + questionType.slice(1);

  const changeSequence = (direction: "up" | "down") => {
    setQuestions((prevQuestions: TQuestion[] | null) => {
      if (!prevQuestions || prevQuestions.length === 0) return prevQuestions;

      const updatedQuestions = [...prevQuestions];

      if (direction === "up" && index > 0) {
        // Swap questions
        [updatedQuestions[index], updatedQuestions[index - 1]] = [
          updatedQuestions[index - 1],
          updatedQuestions[index],
        ];

        // Update sequence numbers
        updatedQuestions[index].sequence = index + 1;
        updatedQuestions[index - 1].sequence = index;
      } else if (direction === "down" && index < updatedQuestions.length - 1) {
        // Swap questions
        [updatedQuestions[index], updatedQuestions[index + 1]] = [
          updatedQuestions[index + 1],
          updatedQuestions[index],
        ];

        // Update sequence numbers
        updatedQuestions[index].sequence = index + 1;
        updatedQuestions[index + 1].sequence = index + 2;
      }

      return updatedQuestions;
    });
  };

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
            variant="hiClick"
          >
            <MdEdit />
          </Button>
          {isEditingSequence ? (
            <>
              <Button onClick={() => changeSequence("up")}>Up</Button>
              <Button onClick={() => changeSequence("down")}>Down</Button>
            </>
          ) : null}
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
