import { TProgress, TSurvey } from "@/types/survey";
import { IDBPDatabase, openDB } from "idb";
import { useCallback, useEffect, useState } from "react";

export default function useProgressIDB() {
  const storeName = "progress";
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
      const dbPromise = await openDB("survey_progress", 1, {
        upgrade(database) {
          // Creates an object store:
          database.createObjectStore(storeName);
        },
      });
      setDB(dbPromise);
      setIsCreatingStore(false);
    })();
  }, []);

  const updateProgress = useCallback(
    async (progress: TProgress, survey_id: TSurvey["id"]) => {
      if (!db || isCreatingStore) return;
      const tx = db.transaction(storeName, "readwrite");
      await tx.store.put(progress, survey_id);
      await tx.done;
    },
    [db, isCreatingStore],
  );

  const getProgress = useCallback(
    async (survey_id: TSurvey["id"]) => {
      if (!db || isCreatingStore) return;

      const tx = db.transaction(storeName, "readonly");
      const store = tx.store;
      const progress = await store.get(survey_id);
      await tx.done;

      return progress as TProgress;
    },
    [db, isCreatingStore],
  );

  return { updateProgress, getProgress };
}
