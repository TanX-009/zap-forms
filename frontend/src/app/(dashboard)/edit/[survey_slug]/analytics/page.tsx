"use client";

import Loading from "@/components/Loading";
import useFetchSurvey from "@/hooks/fetchSurvey";
import Services from "@/services/serviceUrls";
import isoToNormal from "@/systems/isoToNormal";
import { TSurvey } from "@/types/survey";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useFetchResponses from "@/hooks/fetchResponses";
import Button from "@/components/Button";
import { GoDownload } from "react-icons/go";
import { getAudioMimeType } from "@/systems/mimeType";
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";
import { TGetSurveyResponsesResponse } from "@/services/survey";

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
  const [result, setResult] = useState<
    TGetSurveyResponsesResponse["results"] | null
  >(null);

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
  } = useFetchResponses(setResult);
  const totalPages = Math.ceil(totalCount / pageSize);

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

  if (isSurveyLoading || areAnswersLoading || !survey || !result)
    return <Loading centerStage />;

  return (
    <div className={styles.analytics}>
      {result.responses.length === 0 ? (
        <h2 className={styles.noResponses}>No responses yet!</h2>
      ) : (
        <>
          <div className={styles.bar}>
            <div className={styles.buttons}>
              <p>
                Yesterday: <b>{result.created_yesterday}</b>
              </p>
              <p>
                Today: <b>{result.created_today}</b>
              </p>
              <p>
                Average: <b>{result.average_daily}</b>
              </p>
              <p>
                Total: <b>{totalCount}</b>
              </p>
            </div>
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
          <div className={`${styles.bar} ${styles.center}`}>
            <div className={styles.buttons}>
              <Button disabled={!prevPage} onClick={() => setPage(1)}>
                <MdFirstPage />
              </Button>
              <Button
                disabled={!prevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                <MdChevronLeft />
              </Button>
              <p>
                Page {page} of {totalPages}
              </p>
              <label>
                {""}
                <select
                  className={"input"}
                  value={pageSize}
                  onChange={(e) => {
                    setPage(1);
                    setPageSize(Number(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
              <Button
                disabled={!nextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                <MdChevronRight />
              </Button>
              <Button disabled={!nextPage} onClick={() => setPage(totalPages)}>
                <MdLastPage />
              </Button>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>User</th>
                  <th>Audio</th>
                  {result.responses[0].questions.map((question, index) => {
                    return <th key={index}>{question.text}</th>;
                  })}
                  <th>Created at</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
                </tr>
              </thead>
              <tbody>
                {result.responses.map((response, index) => {
                  const created_at = isoToNormal(response.created_at);
                  return (
                    <tr key={index} className={styles.tr}>
                      <td>
                        {response?.user_details?.email
                          ? response?.user_details?.email || ""
                          : ""}
                      </td>
                      <td>
                        {response.audio_file ? (
                          <audio controls>
                            <source
                              src={`${process.env.NEXT_PUBLIC_SERVER_API_URL}${response.audio_file}`}
                              type={getAudioMimeType(response.audio_file)}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          "-"
                        )}
                      </td>

                      {response.answers.map((answer, index) => {
                        let ans = "-";
                        const question = response.questions[index];

                        if (answer.text_answer) {
                          ans = answer.text_answer;
                        } else if (answer.numeric_answer) {
                          ans = answer.numeric_answer.toString();
                        } else if (answer.choice_answer && question?.options) {
                          ans =
                            question.options.find(
                              (opt) => opt.id === Number(answer.choice_answer),
                            )?.text || "-";
                        } else if (
                          Array.isArray(answer.checkbox_answers) &&
                          answer.checkbox_answers.length > 0 &&
                          question.options
                        ) {
                          ans =
                            answer.checkbox_answers
                              .map(
                                (id) =>
                                  question.options &&
                                  question.options.find(
                                    (opt) => opt.id === Number(id),
                                  )?.text,
                              )
                              .filter(Boolean)
                              .join(", ") || "-";
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
