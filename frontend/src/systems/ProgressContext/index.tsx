"use client";

import { TProgress } from "@/types/survey";
import React, { createContext, ReactNode, Component } from "react";

// Define the context type
export type TProgressContext = {
  progress: TProgress;
  setProgress: (progress: TProgress, callback?: (() => void) | null) => void;
  updateProgress: (
    progress: Partial<TProgress>,
    callback?: (() => void) | null,
  ) => void;
  deleteProgress: (callback?: (() => void) | null) => void;
};

// Create the context
export const ProgressContext = createContext<TProgressContext>({
  progress: {
    survey_slug: null,
    startTime: null,
    questionNo: null,
    answers: [],
  },
  setProgress: () => {},
  updateProgress: () => {},
  deleteProgress: () => {},
});

interface TProps {
  children: ReactNode;
}

export default class ProgressContextComponent extends Component<
  TProps,
  TProgress
> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      survey_slug: null,
      startTime: null,
      questionNo: null,
      answers: [],
    };
  }

  render() {
    const { children } = this.props;

    return (
      <ProgressContext.Provider
        value={{
          progress: this.state,
          setProgress: (progress, callback = null) => {
            if (callback) {
              this.setState(progress, callback);
            } else this.setState(progress);
          },
          updateProgress: (progress, callback = null) => {
            if (callback) {
              this.setState({ ...this.state, ...progress }, callback);
            } else this.setState({ ...this.state, ...progress });
          },
          deleteProgress: (callback = null) => {
            if (callback) {
              this.setState(
                {
                  survey_slug: null,
                  startTime: null,
                  questionNo: null,
                  answers: [],
                },
                callback,
              );
            } else
              this.setState({
                survey_slug: null,
                startTime: null,
                questionNo: null,
                answers: [],
              });
          },
        }}
      >
        {children}
      </ProgressContext.Provider>
    );
  }
}
