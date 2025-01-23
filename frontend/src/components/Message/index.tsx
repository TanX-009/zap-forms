import React, { ReactNode } from "react";

interface TProps {
  children: ReactNode;
}

export default function Message({ children }: TProps) {
  if (!children && children !== "") {
    return <p>{children}</p>;
  }
  return <></>;
}
