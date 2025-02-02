import React, { MouseEvent, ReactNode } from "react";

interface TProps {
  children: ReactNode;
  className?: string;
  variant?: "loClick" | "hiClick";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  className = "",
  variant = "loClick",
  type = "button",
  disabled = false,
  ariaLabel = "",
  onClick = () => {},
}: TProps) {
  return (
    <button
      className={`${variant} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
