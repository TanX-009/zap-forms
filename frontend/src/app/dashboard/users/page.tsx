"use client";

import useFetchUsers from "@/hooks/fetchUsers";
import { TUser } from "@/types/user";
import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<TUser[]>([]);
  const { isLoading, fetchUsers } = useFetchUsers(setUsers);
  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(isLoading, users);
  return (
    <div>
      {isLoading
        ? "Loading..."
        : users.map((user, index) => (
            <div key={index}>
              <p>{user.username}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
              <p>------------------------------------</p>
            </div>
          ))}
    </div>
  );
}
