"use client";

import { TAnswer, TQuestion, TSurvey } from "@/types/survey";
import { TUser } from "@/types/user";
import React, {
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
  useRef,
} from "react";

export type TSurveyContext = {
  survey: TSurvey | null;
  setSurvey: Dispatch<SetStateAction<TSurvey | null>>;
  questions: TQuestion[] | null;
  setQuestions: Dispatch<SetStateAction<TQuestion[] | null>>;
  answers: TAnswer[];
  setAnswers: Dispatch<SetStateAction<TAnswer[]>>;
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
  complete: boolean;
  setComplete: Dispatch<SetStateAction<boolean>>;
  audio: {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => Promise<Blob | null>;
  };
  getLocation: () => Promise<{
    longitude: number | null;
    latitude: number | null;
  }>;
};

export const SurveyContext = createContext<TSurveyContext>({
  survey: null,
  setSurvey: () => {},
  questions: [],
  setQuestions: () => {},
  answers: [],
  setAnswers: () => {},
  user: null,
  setUser: () => {},
  complete: false,
  setComplete: () => {},
  audio: {
    isRecording: false,
    startRecording: () => {},
    stopRecording: async () => null,
  },
  getLocation: async () => ({ longitude: null, latitude: null }),
});

interface TProps {
  children: ReactNode;
}

export default function SurveyContextComponent({ children }: TProps) {
  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [questions, setQuestions] = useState<TQuestion[] | null>([]);
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [user, setUser] = useState<TUser | null>(null);
  const [complete, setComplete] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      try {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/wav",
              });
              audioChunksRef.current = [];
              resolve(audioBlob);
            } else {
              resolve(null);
            }
          };

          mediaRecorderRef.current.stop();
          setIsRecording(false);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        resolve(null);
      }
    });
  };

  const getLocation = (): Promise<{
    longitude: number | null;
    latitude: number | null;
  }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        resolve({ latitude: null, longitude: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          resolve({ latitude: null, longitude: null });
        },
      );
    });
  };

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurvey,
        questions,
        setQuestions,
        answers,
        setAnswers,
        user,
        setUser,
        complete,
        setComplete,
        audio: {
          isRecording,
          startRecording,
          stopRecording,
        },
        getLocation,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
