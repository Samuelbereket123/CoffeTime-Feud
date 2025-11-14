export interface SurveyAnswer {
  answer: string;
  points: number; // Number of people (out of 100) who gave this answer
  revealed: boolean;
}

export interface Question {
  id: string;
  question: string;
  answers: SurveyAnswer[];
  category: string;
  round: number; // 1-4, determines point multiplier
  faceOffQuestion?: string; // Optional different phrasing for face-off
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
}

// Custom questions array
export const questions: Question[] = [];
