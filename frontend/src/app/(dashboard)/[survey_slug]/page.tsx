import React from "react";
import styles from "./styles.module.css";

export default async function EditSurvey({
  params,
}: {
  params: Promise<{ survey_slug: string }>;
}) {
  const survey_slug = (await params).survey_slug;
  console.log(survey_slug);
  return (
    <div className={styles.editSurvey}>
      <div className={styles.bar}>
        <h3></h3>
      </div>
    </div>
  );
}
