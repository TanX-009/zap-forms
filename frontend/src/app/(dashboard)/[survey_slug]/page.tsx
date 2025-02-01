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
import UpdateQuestion from "./components/UpdateQuestion";
import UpdateSurvey from "./components/UpdateSurvey";
import Loading from "@/components/Loading";

export default function EditSurvey() {
  const params = useParams();

  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [questions, setQuestions] = useState<TQuestion[] | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateQuestion, setUpdateQuestion] = useState({
    isVisible: false,
    question: {} as TQuestion,
  });
  const [isSurveyUpdating, setIsSurveyUpdating] = useState(false);
  const [questionTick, updateQuestionTick] = useState(false);
  const [surveyTick, updateSurveyTick] = useState(false);

  // click handlers
  const onQuestionAdded = () => {
    setIsAdding(false);
    updateQuestionTick(!questionTick);
  };

  const onQuestionUpdate = () => {
    setUpdateQuestion({
      ...updateQuestion,
      isVisible: false,
    });
    updateQuestionTick(!questionTick);
  };

  const onSurveyUpdate = () => {
    setIsSurveyUpdating(false);
    updateSurveyTick(!surveyTick);
  };

  const setIsQuestionUpdating = (isVisible: boolean) => {
    setUpdateQuestion({ ...updateQuestion, isVisible });
  };

  // data fetching
  const { isLoading: isSurveyLoading, fetchSurvey } = useFetchSurvey(setSurvey);
  const { isLoading: areQuestionsLoading, fetchQuestions } =
    useFetchQuestions(setQuestions);

  useEffect(() => {
    if (typeof params.survey_slug === "string") fetchSurvey(params.survey_slug);
  }, [surveyTick, params.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (survey && survey.id) fetchQuestions(survey.id);
  }, [questionTick, survey, fetchQuestions]);

  if (!survey || !questions) return <Loading centerStage={true} />;
  return (
    <div className={styles.editSurvey}>
      <Modal
        title="Update survey"
        isVisible={isSurveyUpdating}
        setIsVisible={setIsSurveyUpdating}
      >
        <UpdateSurvey survey={survey} onSurveyUpdate={onSurveyUpdate} />
      </Modal>

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

      <Modal
        title="Update question"
        isVisible={updateQuestion.isVisible}
        setIsVisible={setIsQuestionUpdating}
      >
        <UpdateQuestion
          question={updateQuestion.question}
          updateTick={onQuestionUpdate}
        />
      </Modal>

      {!isSurveyLoading ? (
        <div className={styles.bar}>
          <div>
            <h3 className={styles.surveyName}>{survey.name}</h3>
            <p>{survey.description}</p>
            <p>
              <b>Status: </b>
              {survey.online ? "Online" : "Offline"}
            </p>
          </div>
          <div className={styles.buttons}>
            <Button onClick={() => setIsSurveyUpdating(true)}>Edit</Button>
            <Button
              className={styles.delete}
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <Loading centerStage={true} />
      )}
      {!areQuestionsLoading ? (
        <>
          <div className={styles.bar}>
            <div>
              <h3 className={styles.questionsTitle}>Questions</h3>
              <p>
                <b>Count: </b>
                {questions.length}
              </p>
            </div>
            <div className={styles.buttons}>
              <Button disabled={true}>Edit sequence</Button>
            </div>
          </div>
          <div className={styles.questions}>
            {questions.length === 0 ? (
              <h4>No questions added yet!</h4>
            ) : (
              questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  question={question}
                  setUpdateQuestion={setUpdateQuestion}
                />
              ))
            )}
            <Button onClick={() => setIsAdding(true)}>Add question</Button>
          </div>
        </>
      ) : (
        <Loading centerStage={true} />
      )}
    </div>
  );
}
