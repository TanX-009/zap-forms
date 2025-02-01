import Error from "@/components/Error";
import React from "react";
import { FaRegFrown } from "react-icons/fa";

export default function NotFound() {
  return (
    <>
      <Error icon={<FaRegFrown />}>Page not found!</Error>
    </>
  );
}
