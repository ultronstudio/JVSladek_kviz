
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum GameState {
  Welcome,
  Playing,
  Finished,
}
