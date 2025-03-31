"use client";

import Loading from "@/components/Loading";
import useFetchSurvey from "@/hooks/fetchSurvey";
import Services from "@/services/serviceUrls";
import isoToNormal from "@/systems/isoToNormal";
import { TSurvey, TSurveyResponses } from "@/types/survey";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useFetchResponses from "@/hooks/fetchResponses";
import Button from "@/components/Button";
import { GoDownload } from "react-icons/go";

//const pageOptions = [
//  { value: "10", label: "10" },
//  { value: "20", label: "20" },
//  { value: "30", label: "30" },
//  { value: "50", label: "50" },
//  { value: "100", label: "100" },
//];

export default function Analysis() {
  const params = useParams();
  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [responses, setResponses] = useState<TSurveyResponses[] | null>(null);

  // data fetching
  const { isLoading: isSurveyLoading, fetchSurvey } = useFetchSurvey(setSurvey);

  const {
    isLoading: areAnswersLoading,
    fetchResponses,
    page,
    pageSize,
    setPageSize,
    nextPage,
    prevPage,
    totalCount,
    setPage,
  } = useFetchResponses(setResponses);

  useEffect(() => {
    if (typeof params.survey_slug === "string") fetchSurvey(params.survey_slug);
  }, [params.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (typeof params.survey_slug === "string") {
      fetchSurvey(params.survey_slug);
    }
  }, [params.survey_slug, fetchSurvey]);

  useEffect(() => {
    if (survey?.id) fetchResponses(survey.id, page);
  }, [survey, page, fetchResponses]);

  if (isSurveyLoading || areAnswersLoading || !survey || !responses)
    return <Loading centerStage />;

  return (
    <div className={styles.analytics}>
      {responses.length === 0 ? (
        <h2 className={styles.noResponses}>No responses yet!</h2>
      ) : (
        <>
          <div className={styles.pagination}>
            <p>
              Page {page} of {Math.ceil(totalCount / pageSize)}
            </p>
            <label>
              {"Page Size: "}
              <select
                className={"input"}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>
            <div className={styles.buttons}>
              <Button
                disabled={!prevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={!nextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>

              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_API_URL}/${Services.exportSurvey.replace(
                  "$$survey_id$$",
                  survey.id.toString(),
                )}`}
                className={`hiClick ${styles.downloadCSV}`}
              >
                <GoDownload /> CSV
              </a>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>User</th>
                  <th>Audio</th>
                  {responses[0].questions.map((question, index) => {
                    return <th key={index}>{question.text}</th>;
                  })}
                  <th>Created at</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => {
                  const created_at = isoToNormal(response.created_at);
                  return (
                    <tr key={index} className={styles.tr}>
                      <td>{response.user.email || ""}</td>
                      <td>
                        {response.audio_file ? (
                          <audio controls>
                            <source
                              src={`${process.env.NEXT_PUBLIC_SERVER_API_URL}${Services.audio}${response.audio_file}`}
                              type="audio/wav"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          "-"
                        )}
                      </td>
                      {response.answers.map((answer, index) => {
                        let ans = "-";
                        if (answer.text_answer) ans = answer.text_answer;
                        if (answer.numeric_answer)
                          ans = answer.numeric_answer.toString();
                        if (
                          answer.choice_answer &&
                          response.questions[index].options
                        ) {
                          ans =
                            response.questions[index]?.options[
                              Number(answer.choice_answer)
                            ]?.text;
                        }

                        if (
                          answer.checkbox_answers.length > 0 &&
                          response.questions[index].options
                        ) {
                          const anss: string[] = [];

                          for (
                            let i = 0;
                            i < answer.checkbox_answers.length;
                            i++
                          ) {
                            for (
                              let j = 0;
                              j < response.questions[index].options.length;
                              j++
                            ) {
                              if (
                                response.questions[index].options[j].id ===
                                Number(answer.checkbox_answers[i])
                              )
                                anss.push(
                                  response.questions[index].options[j].text,
                                );
                            }
                          }
                          ans = anss.join(", ");
                        }
                        return (
                          <td className={styles.queTD} key={index}>
                            {ans}
                          </td>
                        );
                      })}
                      <td>
                        {created_at.time} {created_at.date}
                      </td>
                      <td>{response.longitude}</td>
                      <td>{response.latitude}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
