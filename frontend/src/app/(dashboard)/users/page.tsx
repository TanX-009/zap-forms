"use client";

import useFetchUsers from "@/hooks/fetchUsers";
import { TUser } from "@/types/user";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../components/LoginContext";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import AddUser from "./components/AddUser";
import { useRouter } from "next/navigation";
import UpdateUser from "./components/UpdateUser";
import UserCard from "./components/UserCard";

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
  }, [tick, fetchUsers]);

  // redirections
  useEffect(() => {
    if (login?.role !== "admin") {
      router.push("/");
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
        <Button variant="hiClick" onClick={onAddUser}>
          Add user
        </Button>
      </div>
      <div className={styles.list}>
        {isLoading
          ? "Loading..."
          : users
              .filter((user) => {
                return user.id !== login?.id;
              })
              .map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  setUpdateUser={setUpdateUser}
                />
              ))}
      </div>
    </div>
  );
}
