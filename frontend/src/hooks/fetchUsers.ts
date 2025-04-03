"use client";

import ManagementService from "@/services/management";
import { TUser } from "@/types/user";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export default function useFetchUsers(
  setter: Dispatch<SetStateAction<TUser[]>>,
) {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    try {
      setIsLoading(true);
      const response = await ManagementService.getUsers();
      if (response.success) setter(response.data);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [setter]);

  return { isLoading, fetchUsers };
}
