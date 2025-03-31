import { TSubmitSurveyRequest } from "@/services/survey";
import { IDBPDatabase, openDB } from "idb";
import { useCallback, useEffect, useState } from "react";

export interface TSavedResponse {
  startTime: string;
  surveyResponse: TSubmitSurveyRequest;
}

export default function useResponsesIDB() {
  const storeName = "responses";
  const [db, setDB] = useState<IDBPDatabase | null>(null);
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  // open db
  useEffect(() => {
    if (!("indexedDB" in window)) {
      // Can't use IndexedDB
      console.error("This browser doesn't support IndexedDB");
      return;
    }

    (async () => {
      setIsCreatingStore(true);
      const dbPromise = await openDB("survey_responses", 1, {
        upgrade(database) {
          // Creates an object store:
          database.createObjectStore(storeName, { keyPath: "startTime" });
        },
      });
      setDB(dbPromise);
      setIsCreatingStore(false);
    })();
  }, []);

  const addResponse = useCallback(
    async (savedResponse: TSavedResponse) => {
      if (!db || isCreatingStore) return;
      const tx = db.transaction(storeName, "readwrite");
      await tx.store.put(savedResponse);
      await tx.done;
    },
    [db, isCreatingStore],
  );

  const getResponses = useCallback(async () => {
    if (!db || isCreatingStore) return;

    const tx = db.transaction(storeName, "readonly");
    const store = tx.store;
    const responses = await store.getAll();
    await tx.done;

    return responses as TSavedResponse[];
  }, [db, isCreatingStore]);

  const deleteResponse = useCallback(
    async (startTime: TSavedResponse["startTime"]) => {
      if (!db || isCreatingStore) return;

      const tx = db.transaction(storeName, "readwrite");
      const store = tx.store;
      await store.delete(startTime);
      await tx.done;
    },
    [db, isCreatingStore],
  );

  return { addResponse, getResponses, deleteResponse };
}
