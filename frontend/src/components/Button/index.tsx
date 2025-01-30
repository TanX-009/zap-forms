import React, { MouseEvent, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  className?: string;
  variant?: "loClick" | "hiClick";
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  className = "",
  variant = "loClick",
  type = "button",
  onClick = () => {},
}: TProps) {
  return (
    <button className={`${variant} ${className}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
