import { TApiResponse } from "@/services/serviceConfig";
import { Dispatch, SetStateAction } from "react";

export default function handleResponse<TResponse>(
  response: TApiResponse<TResponse>,
  successMessage: string,
  setMessage: Dispatch<
    SetStateAction<{ value: string; status: "success" | "neutral" | "error" }>
  >,
  successCallback: (res: TResponse) => void,
) {
  if (response.success) {
    setMessage({
      value: successMessage,
      status: "success",
    });
    successCallback(response.data);
  } else if (response.status === 400) {
    const message =
      typeof response.error.data === "object"
        ? Object.values(response.error.data)[0][0]
        : "Something went wrong!";
    if (typeof message === "string")
      setMessage({ value: message, status: "error" });
    else
      setMessage({ value: "Unknown error response message!", status: "error" });
  } else if (response.status === 401) {
    console.error("401", response);
    setMessage({ value: "Invalid email or password!", status: "error" });
  } else if (response.status === 403) {
    setMessage({
      value: "You are not authorized to perform this action!",
      status: "error",
    });
  } else {
    setMessage({ value: "Unknown Error !", status: "error" });
  }
}
