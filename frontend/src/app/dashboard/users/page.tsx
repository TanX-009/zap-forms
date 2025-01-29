"use client";

import useFetchUsers from "@/hooks/fetchUsers";
import { TUser } from "@/types/user";
import React, { useContext, useEffect, useState } from "react";
import User from "./components/User";
import { LoginContext } from "../components/LoginContext";
import styles from "./styles.module.css";
import Button from "@/components/Button/components";
import Modal from "@/components/Modal";
import AddUser from "./components/AddUser";

export default function Users() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [login] = useContext(LoginContext);
  const [isAddUserDialogVisible, setIsAddUserDialogVisible] = useState(false);

  const onAddUser = () => {
    setIsAddUserDialogVisible(true);
  };

  const { isLoading, fetchUsers } = useFetchUsers(setUsers);
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.users}>
      <Modal
        title="Add user"
        isVisible={isAddUserDialogVisible}
        setIsVisible={setIsAddUserDialogVisible}
      >
        <AddUser />
      </Modal>

      <div className={styles.bar}>
        <h2>Users</h2>
        <Button onClick={onAddUser}>Add user</Button>
      </div>
      <div className={styles.list}>
        {isLoading
          ? "Loading..."
          : users
              .filter((user) => {
                return user.id !== login?.id;
              })
              .map((user, index) => (
                <User key={index} {...user} isAdmin={login?.role === "admin"} />
              ))}
      </div>
    </div>
  );
}
