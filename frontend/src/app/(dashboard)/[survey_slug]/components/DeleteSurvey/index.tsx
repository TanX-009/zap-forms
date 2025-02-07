import Button from "@/components/Button";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import SurveyService from "@/services/survey";
import Message from "@/components/Message";
import { useRouter } from "next/navigation";
import handleResponse from "@/systems/handleResponse";

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

    handleResponse(response, "Survey deleted successfully!", setMessage, () => {
      router.push("/");
    });
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
