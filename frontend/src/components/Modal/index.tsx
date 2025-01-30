import React from "react";
import styles from "./styles.module.css";
import { MdClose } from "react-icons/md";
import Button from "../Button";

interface TProps {
  children: React.ReactNode;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  title?: string;
}

export default function Modal({
  children,
  isVisible,
  setIsVisible,
  title = "",
}: TProps) {
  const onClose = () => {
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return (
    <div className={styles.modal}>
      <div className={"panel " + styles.dialog}>
        <Button className={styles.close} onClick={onClose}>
          <MdClose />
        </Button>
        <h3>{title}</h3>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
