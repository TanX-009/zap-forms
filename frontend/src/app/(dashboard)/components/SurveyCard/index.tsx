import { TSurvey } from "@/types/survey";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import isoToNormal from "@/systems/isoToNormal";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/app/actions/url";
import Link from "next/link";

interface TProps {
  survey: TSurvey;
}

export default function SurveyCard({ survey }: TProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const created_at = isoToNormal(survey.created_at);

  const onCopy = async () => {
    try {
      const baseUrl = await getBaseUrl();
      await navigator.clipboard.writeText(`${baseUrl}/survey/${survey.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const onShare = async () => {
    try {
      const baseUrl = await getBaseUrl();
      await navigator.share({
        title: "Check this out!",
        text: "I found something interesting!",
        url: `${baseUrl}/survey/${survey.slug}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={`panel ${styles.survey}`}>
      <div className={styles.title}>
        <h4>{survey.name}</h4>
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              router.push(`/edit/${survey.slug}`);
            }}
          >
            Edit
          </Button>
          {copied ? (
            <Button disabled>Copied!</Button>
          ) : (
            <Button onClick={onCopy}>Copy link</Button>
          )}
          {"share" in navigator ? (
            <Button onClick={onShare}>Share</Button>
          ) : null}

          <Link className={"loClick"} href={`/edit/${survey.slug}/analytics`}>
            Analytics
          </Link>
        </div>
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
