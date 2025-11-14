'use client';

import { SurveyAnswer } from '../data/questions';

interface QuestionCardProps {
  question: string;
  answers: SurveyAnswer[];
  revealedIndices: number[];
  onReveal: (index: number) => void;
}

export default function QuestionCard({ 
  question, 
  answers, 
  revealedIndices, 
  onReveal 
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-8">{question}</h1>
      
      <div className="grid gap-4">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onReveal(index)}
            className={`p-4 text-xl font-medium rounded-lg transition-all ${
              revealedIndices.includes(index)
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-dashed border-amber-200'
            }`}
            disabled={revealedIndices.includes(index)}>
            {revealedIndices.includes(index) 
              ? `${answer.answer} (${answer.points} points)` 
              : '???'}
          </button>
        ))}
      </div>
    </div>
  );
}
