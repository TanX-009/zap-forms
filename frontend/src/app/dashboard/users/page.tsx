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
import { useRouter } from "next/navigation";
import UpdateUser from "./components/UpdateUser";

export default function Users() {
  const router = useRouter();

  const [users, setUsers] = useState<TUser[]>([]);
  const [login] = useContext(LoginContext);
  const [isAddUserDialogVisible, setIsAddUserDialogVisible] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    isVisible: false,
    user: {} as TUser,
  });
  const [tick, updateTick] = useState(false);

  const onAddTick = () => {
    setIsAddUserDialogVisible(false);
    updateTick(!tick);
  };

  const onUpdateTick = () => {
    setUpdateUser({
      ...updateUser,
      isVisible: false,
    });
    updateTick(!tick);
  };

  const setIsUpdateUserDialogVisible = (isVisible: boolean) => {
    setUpdateUser({ ...updateUser, isVisible });
  };

  const onAddUser = () => {
    setIsAddUserDialogVisible(true);
  };

  const { isLoading, fetchUsers } = useFetchUsers(setUsers);
  useEffect(() => {
    fetchUsers();
  }, [tick]);

  // redirections
  useEffect(() => {
    if (login?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [login?.role, router]);
  if (login?.role !== "admin") {
    return "Redirecting...";
  }

  return (
    <div className={styles.users}>
      <Modal
        title="Add user"
        isVisible={isAddUserDialogVisible}
        setIsVisible={setIsAddUserDialogVisible}
      >
        <AddUser updateTick={onAddTick} />
      </Modal>

      <Modal
        title="Update user"
        isVisible={updateUser.isVisible}
        setIsVisible={setIsUpdateUserDialogVisible}
      >
        <UpdateUser user={updateUser.user} updateTick={onUpdateTick} />
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
                <User key={index} user={user} setUpdateUser={setUpdateUser} />
              ))}
      </div>
    </div>
  );
}
