import { TSurvey } from "@/types/survey";
import React from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import isoToNormal from "@/systems/isoToNormal";
import { useRouter } from "next/navigation";

interface TProps {
  survey: TSurvey;
}

export default function SurveyCard({ survey }: TProps) {
  const router = useRouter();

  const created_at = isoToNormal(survey.created_at);

  return (
    <div className={`panel ${styles.survey}`}>
      <div className={styles.title}>
        <h4>{survey.name}</h4>
        <Button
          onClick={() => {
            router.push(`/${survey.slug}`);
          }}
        >
          Edit
        </Button>
      </div>

      <p>{survey.description}</p>
      <div className={styles.surveyInfo}>
        <p>
          <b>Created at</b>:{" "}
          {`${created_at.time}, ${created_at.day}, ${created_at.date}`}
        </p>
        <p>
          <b>Status</b>: {survey.online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
