"use client";

import ManagementService from "@/services/management";
import { TUser } from "@/types/user";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function useFetchUsers(
  setter: Dispatch<SetStateAction<TUser[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ManagementService.getUsers();
      if (response.success) setter(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [setter]);

  return { isLoading, fetchUsers };
}
