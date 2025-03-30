"use client";

import { TAnswer, TCoords, TQuestion, TSurvey } from "@/types/survey";
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
  complete: boolean;
  setComplete: Dispatch<SetStateAction<boolean>>;
  audio: {
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => Promise<Blob | null>;
  };
  location: TCoords;
  getLocation: () => Promise<void>;
};

export const SurveyContext = createContext<TSurveyContext>({
  survey: null,
  setSurvey: () => {},
  questions: [],
  setQuestions: () => {},
  answers: [],
  setAnswers: () => {},
  complete: false,
  setComplete: () => {},
  audio: {
    isRecording: false,
    startRecording: () => {},
    stopRecording: async () => null,
  },
  location: { longitude: null, latitude: null },
  getLocation: async () => {},
});

interface TProps {
  children: ReactNode;
}

export default function SurveyContextComponent({ children }: TProps) {
  const [survey, setSurvey] = useState<TSurvey | null>(null);
  const [questions, setQuestions] = useState<TQuestion[] | null>([]);
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [complete, setComplete] = useState(false);
  const [location, setLocation] = useState<TCoords>({
    longitude: null,
    latitude: null,
  });

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

  const getLocation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          resolve();
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
        complete,
        setComplete,
        audio: {
          isRecording,
          startRecording,
          stopRecording,
        },
        location,
        getLocation,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
