"use client";

import Modal from "@/components/Modal";
import styles from "./styles.module.css";
import { useContext, useEffect, useState } from "react";
import Button from "@/components/Button";
import AddSurvey from "./components/AddSurvey";
import useFetchSurveys from "@/hooks/fetchSurveys";
import { TSurvey } from "@/types/survey";
import SurveyCard from "./components/SurveyCard";
import { LoginContext } from "@/systems/LoginContext";
import Loading from "@/components/Loading";
import Uploading from "./components/Uploading";

export default function Home() {
  const [surveys, setSurveys] = useState<TSurvey[]>([]);

  const [isAddSurveyVisible, setIsAddSurveyVisible] = useState(false);
  const { user } = useContext(LoginContext);

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
      <div className={styles.surveys}>
        <Uploading />

        {user?.role === "admin" ? (
          <Button
            variant="hiClick"
            className={styles.addSurvey}
            onClick={() => setIsAddSurveyVisible(true)}
          >
            Add survey
          </Button>
        ) : null}

        {isLoading ? (
          <Loading centerStage />
        ) : surveys.length === 0 ? (
          <div className={styles.empty}>No surveys added!</div>
        ) : (
          surveys.map((survey, index) => (
            <SurveyCard key={index} survey={survey} />
          ))
        )}
      </div>
    </div>
  );
}
