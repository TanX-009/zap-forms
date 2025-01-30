import Button from "@/components/Button";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import SurveyService from "@/services/survey";
import Message from "@/components/Message";
import { useRouter } from "next/navigation";

interface TProps {
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  slug: string;
}

export default function DeleteSurvey({ setIsDeleting, slug }: TProps) {
  const router = useRouter();

  const [message, setMessage] = useState<{
    value: string;
    status: "neutral" | "error" | "success";
  }>({ value: "", status: "neutral" });

  const onDelete = async () => {
    const response = await SurveyService.deleteSurvey(slug);

    if (response.success) {
      setMessage({ value: "Survey deleted successfully!", status: "success" });
      router.push("/");
    } else if (response.status === 400) {
      const message =
        typeof response.error.data === "object"
          ? Object.values(response.error.data)[0]
          : "Something went wrong!";
      setMessage({ value: message, status: "error" });
    } else if (response.status === 403) {
      setMessage({
        value: "You are not authorized to perform this action!",
        status: "error",
      });
    } else {
      setMessage({ value: "Unknown Error !", status: "error" });
    }
  };
  return (
    <div className={styles.deleteSurvey}>
      <h4>
        Are you sure you want to delete this survey?
        <br />
        <span className={styles.alert}>Warning: </span>
        This action cannot be undone.
      </h4>
      <Message status={message.status}>{message.value}</Message>
      <div className={styles.buttons}>
        <Button className={styles.delete} onClick={onDelete}>
          Yes
        </Button>
        <Button onClick={() => setIsDeleting(false)}>No</Button>
      </div>
    </div>
  );
}
