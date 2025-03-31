import { TQuestion, TSurvey } from "@/types/survey";
import { IDBPDatabase, openDB } from "idb";
import { useCallback, useEffect, useState } from "react";

export default function useSurveyIDB() {
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
      const dbPromise = await openDB("survey", 1, {
        upgrade(database) {
          // Creates an object store:
          database.createObjectStore("questions");
          database.createObjectStore("surveys", { keyPath: "slug" });
        },
      });
      setDB(dbPromise);
      setIsCreatingStore(false);
    })();
  }, []);

  const updateQuestions = useCallback(
    async (questions: TQuestion[], survey_id: TSurvey["id"]) => {
      if (!db || isCreatingStore) return;
      const tx = db.transaction("questions", "readwrite");
      await tx.store.put(questions, survey_id);
      await tx.done;
    },
    [db, isCreatingStore],
  );
  const getQuestions = useCallback(
    async (survey_id: TSurvey["id"]) => {
      if (!db || isCreatingStore) return;

      const tx = db.transaction("questions", "readonly");
      const store = tx.store;
      const progress = await store.get(survey_id);
      await tx.done;

      return progress as TQuestion[];
    },
    [db, isCreatingStore],
  );

  // update all surveys
  const updateSurveys = useCallback(
    async (surveys: TSurvey[]) => {
      if (!db || isCreatingStore) return;
      const tx = db.transaction("surveys", "readwrite");
      // set key to cause all the surveys
      surveys.map(async (survey) => {
        await tx.store.put(survey);
      });
      await tx.done;
    },
    [db, isCreatingStore],
  );
  // get single survey based on id
  const getSurvey = useCallback(
    async (survey_id: TSurvey["slug"]) => {
      if (!db || isCreatingStore) return;

      const tx = db.transaction("surveys", "readonly");
      const store = tx.store;
      const progress = await store.get(survey_id);
      await tx.done;

      return progress as TSurvey;
    },
    [db, isCreatingStore],
  );
  // get all surveys
  const getSurveys = useCallback(async () => {
    if (!db || isCreatingStore) return;

    const tx = db.transaction("surveys", "readonly");
    const store = tx.store;
    const surveys = await store.getAll();
    await tx.done;

    return surveys as TSurvey[];
  }, [db, isCreatingStore]);

  return {
    updateQuestions,
    getQuestions,
    getSurvey,
    updateSurveys,
    getSurveys,
  };
}
