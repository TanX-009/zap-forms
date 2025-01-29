import React from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button/components";

interface TProps {
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export default function User({ username, email, role, isAdmin }: TProps) {
  return (
    <div className={"panel " + styles.user}>
      <div>
        <p>
          <b>Username</b>: {username || "-"}
        </p>
        <p>
          <b>Email</b>: {email}
        </p>
        <p>
          <b>Role</b>: {role}
        </p>
      </div>
      {isAdmin ? <Button>Edit</Button> : null}
    </div>
  );
}
