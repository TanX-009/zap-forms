"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useFetchSurvey from "@/hooks/fetchSurvey";
import { TQuestion, TSurvey } from "@/types/survey";
import useFetchQuestions from "@/hooks/fetchQuestions";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import DeleteSurvey from "./components/DeleteSurvey";
import AddQuestion from "./components/AddQuestion";
import QuestionCard from "./components/QuestionCard";

export default function EditSurvey() {
  const params = useParams();

  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [questions, setQuestions] = useState<TQuestion[] | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tick, updateTick] = useState(false);

  const onQuestionAdded = () => {
    setIsAdding(false);
    updateTick(!tick);
  };

  const { isLoading: isSurveyLoading, fetchSurvey } = useFetchSurvey(setSurvey);
  const { isLoading: areQuestionsLoading, fetchQuestions } =
    useFetchQuestions(setQuestions);

  useEffect(() => {
    if (typeof params.survey_slug === "string") fetchSurvey(params.survey_slug);
  }, [params.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (survey && survey.id) fetchQuestions(survey.id);
  }, [tick, survey, fetchQuestions]);

  if (!survey || !questions) return "Loading...";
  return (
    <div className={styles.editSurvey}>
      <Modal
        title="Delete survey"
        isVisible={isDeleting}
        setIsVisible={setIsDeleting}
      >
        <DeleteSurvey setIsDeleting={setIsDeleting} slug={survey.slug} />
      </Modal>

      <Modal
        title="Add question"
        isVisible={isAdding}
        setIsVisible={setIsAdding}
      >
        <AddQuestion survey={survey} updateTick={onQuestionAdded} />
      </Modal>

      {!isSurveyLoading ? (
        <div className={styles.bar}>
          <h3>{survey.name}</h3>
          <div className={styles.buttons}>
            <Button>Change sequence</Button>
            <Button
              className={styles.delete}
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
      {!areQuestionsLoading ? (
        <div className={styles.questions}>
          {questions.length === 0 ? (
            <h4>No questions added yet!</h4>
          ) : (
            questions.map((question, index) => (
              <QuestionCard key={index} question={question} />
            ))
          )}
          <Button onClick={() => setIsAdding(true)}>Add question</Button>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
