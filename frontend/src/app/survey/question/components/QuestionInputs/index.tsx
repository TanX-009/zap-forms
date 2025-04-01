import Input from "@/components/Input";
import { TAnswer, TQuestion } from "@/types/survey";
import React from "react";
import RequiredStar from "@/components/RequiredStar";
import RadioGroup from "@/components/RadioGroup";
import CheckboxGroup from "@/components/CheckboxGroup";

const convertOptions = (
  options: { id: number; question: TQuestion["id"]; text: string }[] | null,
): { value: string; label: string }[] => {
  if (!options) return [];
  return options.map((option) => ({
    value: option.id.toString(),
    label: option.text,
  }));
};

interface TProps {
  question: TQuestion | null;
  savedAnswer: TAnswer | null;
}

export default function QuestionInputs({ question, savedAnswer }: TProps) {
  console.log(question);
  if (!question) return "";

  if (question.type === "text")
    return (
      <Input
        name="answer"
        type="text"
        label={
          <>
            {question.text}
            {question.required ? <RequiredStar /> : null}
          </>
        }
        defaultValue={
          savedAnswer && savedAnswer?.text_answer
            ? savedAnswer.text_answer
            : undefined
        }
        minLength={question.min_length}
        maxLength={question.max_length}
        placeholder={"Text answer..."}
        required={question.required}
      />
    );

  if (question.type === "number")
    return (
      <Input
        name="answer"
        type="number"
        label={
          <>
            {question.text}
            {question.required ? <RequiredStar /> : null}
          </>
        }
        minLength={question.min_length}
        maxLength={question.max_length}
        defaultValue={
          savedAnswer && savedAnswer?.numeric_answer
            ? savedAnswer.numeric_answer
            : undefined
        }
        placeholder={"Numeric answer..."}
        required={question.required}
      />
    );

  if (question.type === "multiple-choice")
    return (
      <RadioGroup
        search
        name="answer"
        label={
          <>
            {question.text}
            {question.required ? <RequiredStar /> : null}
          </>
        }
        defaultValue={
          savedAnswer && savedAnswer.choice_answer
            ? savedAnswer.choice_answer.toString()
            : null
        }
        options={convertOptions(question.options)}
        required={question.required}
      />
    );

  if (question.type === "checkbox")
    return (
      <CheckboxGroup
        search
        name="answer"
        label={
          <>
            {question.text}
            {question.required ? <RequiredStar /> : null}
          </>
        }
        defaultValue={
          savedAnswer && savedAnswer?.checkbox_answers
            ? savedAnswer.checkbox_answers
            : []
        }
        options={convertOptions(question.options)}
        required={question.required}
      />
    );

  return "";
}
