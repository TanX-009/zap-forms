import { TSurvey } from "@/types/survey";
import React, { useContext } from "react";
import styles from "./styles.module.css";
import isoToNormal from "@/systems/isoToNormal";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import { LoginContext } from "@/systems/LoginContext";
import { ProgressContext } from "@/systems/ProgressContext";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import useProgressIDB from "@/hooks/progressIDB";

interface TProps {
  survey: TSurvey;
}

export default function SurveyCard({ survey }: TProps) {
  const router = useRouter();

  const created_at = isoToNormal(survey.created_at);
  const { user } = useContext(LoginContext);
  const { setProgress, updateProgress } = useContext(ProgressContext);
  const { getProgress } = useProgressIDB();

  const onOpen = async () => {
    const push = () => {
      router.push("/survey");
    };

    const savedProgress = await getProgress(survey.slug);
    if (savedProgress) setProgress(savedProgress, push);
    else updateProgress({ survey_slug: survey.slug }, push);
  };

  return (
    <div className={`panel ${styles.survey}`}>
      <div className={styles.title}>
        <h4>{survey.name}</h4>
        <div className={styles.buttons}>
          <Button onClick={onOpen}>Open</Button>

          {user?.role === "admin" ? (
            <>
              <Link className={"hiClick"} href={`/edit/${survey.slug}`}>
                <MdEdit />
              </Link>

              <Link
                className={"loClick"}
                href={`/edit/${survey.slug}/analytics`}
              >
                <IoAnalytics />
              </Link>
            </>
          ) : null}
        </div>
      </div>

      <p>{survey.description}</p>
      <div className={styles.surveyInfo}>
        <p>
          <b>Created at</b>:{" "}
          {`${created_at.time}, ${created_at.day}, ${created_at.date}`}
        </p>
        <p>
          <b>Status</b>:{" "}
          <span className={survey.online ? "success" : "error"}>
            {survey.online ? "Online" : "Offline"}
          </span>
        </p>
      </div>
    </div>
  );
}
