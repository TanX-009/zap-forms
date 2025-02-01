import React, { MouseEvent, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  className?: string;
  variant?: "loClick" | "hiClick";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  className = "",
  variant = "loClick",
  type = "button",
  disabled = false,
  onClick = () => {},
}: TProps) {
  return (
    <button
      className={`${variant} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
