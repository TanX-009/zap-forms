import React, { ReactNode } from "react";

interface TProps {
  children: ReactNode;
  status?: "error" | "success" | "neutral";
}

export default function Message({ children, status = "success" }: TProps) {
  let color = "var(--primary)";
  if (status === "error") color = "var(--error)";
  else if (status === "neutral") color = "var(--onSurface)";
  else if (status === "success") color = "var(--success)";

  if (children && children !== "") {
    return <p style={{ color: color }}>{children}</p>;
  }
  return <></>;
}
