import { TAnswer } from "@/types/survey";
import { IDBPDatabase, openDB } from "idb";
import { useCallback, useEffect, useState } from "react";

async function createStoreBeforeUse(
  db: IDBPDatabase | null,
  storeName: string,
) {
  if (!db) return;

  // Checks if the object store exists:
  if (!db.objectStoreNames.contains(storeName)) {
    await db.createObjectStore(storeName, {
      keyPath: "question",
    });
  }
}

export default function useAnswersIDB() {
  const storeName = "answers";
  const [db, setDB] = useState<IDBPDatabase | null>(null);

  // open db
  useEffect(() => {
    if (!("indexedDB" in window)) {
      // Can't use IndexedDB
      console.log("This browser doesn't support IndexedDB");
      return;
    }

    (async () => {
      const dbPromise = await openDB("surveyDB", 1);
      setDB(dbPromise);
    })();
  }, []);

  const updateOrAddAnswer = useCallback(
    async (answer: TAnswer) => {
      createStoreBeforeUse(db, storeName);
      if (!db) return;
      const tx = db.transaction("answers", "readwrite");
      await tx.store.put(answer, answer.question);
      await tx.done;
    },
    [db],
  );

  const getAnswers = useCallback(async () => {
    createStoreBeforeUse(db, storeName);
    if (!db) return;
    const tx = db.transaction("answers", "readonly");
    const store = tx.store;
    const answers = await store.getAll();
    await tx.done;

    return answers as TAnswer[];
  }, [db]);

  return { updateOrAddAnswer, getAnswers };
}
