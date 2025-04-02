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
import SurveyService from "@/services/survey";
import handleResponse from "@/systems/handleResponse";
import Message, { TMessage } from "@/components/Message";
import { MdEdit, MdDelete } from "react-icons/md";

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
  const [isEditingSequence, setIsEditingSequence] = useState(false);
  const [isSurveyUpdating, setIsSurveyUpdating] = useState(false);
  const [questionTick, updateQuestionTick] = useState(false);
  const [surveyTick, updateSurveyTick] = useState(false);

  const [editSequenceMessage, setEditSequenceMessage] = useState<TMessage>({
    value: "",
    status: "neutral",
  });

  // click handlers
  const onQuestionAdded = () => {
    setIsAdding(false);
    updateQuestionTick(!questionTick);
  };

  // update question
  const onQuestionUpdate = () => {
    setUpdateQuestion({
      ...updateQuestion,
      isVisible: false,
    });
    updateQuestionTick(!questionTick);
  };

  // update survey
  const onSurveyUpdate = () => {
    setIsSurveyUpdating(false);
    updateSurveyTick(!surveyTick);
  };

  const setIsQuestionUpdating = (isVisible: boolean) => {
    setUpdateQuestion({ ...updateQuestion, isVisible });
  };

  const onEditQuestionSequence = () => {
    if (questions && questions.length === 0) return;
    setIsEditingSequence(true);
    setEditSequenceMessage({ value: "", status: "neutral" });
  };

  // reorder questions post request
  const onQuestionsReorder = async () => {
    if (!questions || !survey) return;
    setEditSequenceMessage({ value: "Reordering...", status: "neutral" });
    const response = await SurveyService.reorderQuestions(questions);
    handleResponse(
      response,
      "Edited sequence successfully!",
      setEditSequenceMessage,
      () => {
        setIsEditingSequence(false);
        setTimeout(() => {
          setEditSequenceMessage({ value: "", status: "neutral" });
        }, 2000);
      },
    );
  };

  // data fetching
  const { isLoading: isSurveyLoading, fetchSurvey } = useFetchSurvey(setSurvey);
  const { isLoading: areQuestionsLoading, fetchQuestions } =
    useFetchQuestions(setQuestions);

  // fetch survey
  useEffect(() => {
    if (typeof params.survey_slug === "string") fetchSurvey(params.survey_slug);
  }, [surveyTick, params.survey_slug, fetchSurvey]);

  // fetch survey questions
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
        <UpdateSurvey
          survey={survey}
          onSurveyUpdate={onSurveyUpdate}
          questions={questions}
        />
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
              <span className={survey.online ? "success" : "error"}>
                {survey.online ? "Online" : "Offline"}
              </span>
            </p>
          </div>
          <div className={styles.buttons}>
            <Button onClick={() => setIsSurveyUpdating(true)}>
              <MdEdit />
            </Button>
            <Button
              className={styles.delete}
              onClick={() => setIsDeleting(true)}
            >
              <MdDelete />
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
              <h3 className={styles.questionsTitle}>
                Questions: {questions.length}
              </h3>
            </div>
            <div className={`${styles.buttons} ${styles.editSequence}`}>
              {questions.length > 1 ? (
                isEditingSequence ? (
                  <Button onClick={onQuestionsReorder}>
                    Stop editing sequence
                  </Button>
                ) : (
                  <Button onClick={onEditQuestionSequence}>
                    Edit sequence
                  </Button>
                )
              ) : null}
              <Message status={editSequenceMessage.status}>
                {editSequenceMessage.value}
              </Message>
            </div>
          </div>
          <div className={styles.questions}>
            <Button variant="hiClick" onClick={() => setIsAdding(true)}>
              Add question
            </Button>
            {questions.length === 0 ? (
              <h4>No questions added yet!</h4>
            ) : (
              questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  index={index}
                  question={question}
                  setQuestions={setQuestions}
                  setUpdateQuestion={setUpdateQuestion}
                  isEditingSequence={isEditingSequence}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <Loading centerStage={true} />
      )}
    </div>
  );
}
