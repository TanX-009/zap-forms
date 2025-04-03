"use client";

import useFetchUsers from "@/hooks/fetchUsers";
import { TUser } from "@/types/user";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import UserCard from "./components/UserCard";
import Loading from "@/components/Loading";
import { LoginContext } from "@/systems/LoginContext";

export default function Users() {
  const { user } = useContext(LoginContext);

  const [users, setUsers] = useState<TUser[]>([]);
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
        {isLoading ? (
          <Loading centerStage={true} />
        ) : (
          users
            .filter((fetchedUser) => {
              return fetchedUser.id !== user?.id;
            })
            .map((user, index) => (
              <UserCard key={index} user={user} setUpdateUser={setUpdateUser} />
            ))
        )}
      </div>
    </div>
  );
}
