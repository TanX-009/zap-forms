"use client";

import ManagementService from "@/services/management";
import { TUser } from "@/types/user";
import { Dispatch, SetStateAction, useState } from "react";

export default function useFetchUsers(
  setter: Dispatch<SetStateAction<TUser[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await ManagementService.getUsers();
      if (response.success) setter(response.data);
      if (!response.success && response.status === 401) {
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchUsers };
}
