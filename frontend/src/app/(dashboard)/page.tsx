"use client";

import Modal from "@/components/Modal";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import AddSurvey from "./components/AddSurvey";
import useFetchSurveys from "@/hooks/fetchSurveys";
import { TSurvey } from "@/types/survey";
import SurveyCard from "./components/SurveyCard";

export default function Home() {
  const [surveys, setSurveys] = useState<TSurvey[]>([]);

  const [isAddSurveyVisible, setIsAddSurveyVisible] = useState(false);
  //const [tick, updateTick] = useState(false);
  //const onAdd = () => {
  //  updateTick(!tick);
  //  setIsAddSurveyVisible(false);
  //};

  const { isLoading, fetchSurveys } = useFetchSurveys(setSurveys);
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return (
    <div className={styles.page}>
      <Modal
        title="Add survey"
        isVisible={isAddSurveyVisible}
        setIsVisible={setIsAddSurveyVisible}
      >
        <AddSurvey />
      </Modal>
      <div className={styles.bar}>
        <h3>Add survey</h3>
        <Button variant="hiClick" onClick={() => setIsAddSurveyVisible(true)}>
          Add
        </Button>
      </div>
      <div className={styles.surveys}>
        {!isLoading && surveys.length === 0 ? (
          <div className={styles.empty}>No surveys available</div>
        ) : (
          surveys.map((survey, index) => (
            <SurveyCard key={index} survey={survey} />
          ))
        )}
      </div>
    </div>
  );
}
