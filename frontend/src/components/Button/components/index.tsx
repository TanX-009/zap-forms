import React, { MouseEvent } from "react";

interface TProps {
  name: string;
  variant?: "loClick" | "hiClick";
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  name,
  onClick = () => {},
  variant = "loClick",
  type = "button",
}: TProps) {
  return (
    <button className={variant} type={type} onClick={onClick}>
      {name}
    </button>
  );
}
