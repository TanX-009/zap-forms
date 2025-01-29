import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button/components";
import { TUser } from "@/types/user";

interface TProps {
  user: TUser;
  setUpdateUser: Dispatch<SetStateAction<{ isVisible: boolean; user: TUser }>>;
}

export default function User({ user, setUpdateUser }: TProps) {
  return (
    <div className={"panel " + styles.user}>
      <div>
        <p>
          <b>Username</b>: {user.username || "-"}
        </p>
        <p>
          <b>Email</b>: {user.email}
        </p>
        <p>
          <b>Role</b>: {user.role}
        </p>
      </div>
      <Button
        onClick={() => {
          setUpdateUser((val) => ({ ...val, user: user, isVisible: true }));
        }}
      >
        Edit
      </Button>
    </div>
  );
}
