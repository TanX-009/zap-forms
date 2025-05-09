import { TMessage } from "@/components/Message";
import { TApiResponse } from "@/services/serviceConfig";
import { Dispatch, SetStateAction } from "react";

export default async function handleResponse<TResponse>(
  response: TApiResponse<TResponse>,
  successMessage: string,
  setMessage: Dispatch<SetStateAction<TMessage>>,
  successCallback: (res: TResponse) => void | Promise<void>,
) {
  if (response.success) {
    setMessage({
      value: successMessage,
      status: "success",
    });
    await Promise.resolve(successCallback(response.data));
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
