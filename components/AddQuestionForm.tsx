'use client';

import { useState } from 'react';
import { Question, SurveyAnswer } from '@/data/questions';

interface AddQuestionFormProps {
  onAddQuestion: (question: Omit<Question, 'id'>) => void;
}

export default function AddQuestionForm({ onAddQuestion }: AddQuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [round, setRound] = useState(1);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [timeLimit, setTimeLimit] = useState(30);
  const [answers, setAnswers] = useState<Array<{ text: string; points: number }>>([
    { text: '', points: 0 },
  ]);
  const [faceOffQuestion, setFaceOffQuestion] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: '', points: 0 }]);
  };

  const handleAnswerChange = (index: number, field: 'text' | 'points', value: string | number) => {
    const newAnswers = [...answers];
    if (field === 'points') {
      newAnswers[index][field] = Number(value);
    } else {
      newAnswers[index][field] = value as string;
    }
    setAnswers(newAnswers);
  };

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 1) {
      const newAnswers = [...answers];
      newAnswers.splice(index, 1);
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const surveyAnswers: SurveyAnswer[] = answers
      .filter(a => a.text.trim() !== '' && a.points > 0)
      .map(a => ({
        answer: a.text.trim(),
        points: a.points,
        revealed: false
      }));

    if (surveyAnswers.length === 0) {
      alert('Please add at least one valid answer with points');
      return;
    }

    const totalPoints = surveyAnswers.reduce((sum, a) => sum + a.points, 0);
    if (totalPoints > 100) {
      alert('Total points for all answers should not exceed 100');
      return;
    }

    onAddQuestion({
      question: question.trim(),
      answers: surveyAnswers,
      category: 'Custom',
      round,
      difficulty: difficulty || 'Medium',
      timeLimit: timeLimit || 30,
      faceOffQuestion: faceOffQuestion.trim() || question.trim()
    });

    // Reset form
    setQuestion('');
    setFaceOffQuestion('');
    setAnswers([{ text: '', points: 0 }]);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Question</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question *
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
            placeholder="Enter the question"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (seconds) *
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Face-off Question (Optional)
          </label>
          <input
            type="text"
            value={faceOffQuestion}
            onChange={(e) => setFaceOffQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
            placeholder="Enter a shorter version for the face-off round"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Round *
            </label>
            <select
              value={round}
              onChange={(e) => setRound(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              required
            >
              <option value="1">Round 1 (Single Points)</option>
              <option value="2">Round 2 (Double Points)</option>
              <option value="3">Round 3 (Triple Points)</option>
              <option value="4">Round 4 (Final Round)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Answers *
            </label>
            <button
              type="button"
              onClick={handleAddAnswer}
              className="text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              + Add Answer
            </button>
          </div>
          
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                    placeholder={`Answer ${index + 1}`}
                    required={index === 0}
                  />
                </div>
                <div className="w-24">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={answer.points || ''}
                      onChange={(e) => handleAnswerChange(index, 'points', e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                      placeholder="Points"
                      required={index === 0}
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>
                {answers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Remove answer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Total points: {answers.reduce((sum, a) => sum + (Number(a.points) || 0), 0)}/100
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
          >
            Add Question
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
          Question added successfully!
        </div>
      )}
    </div>
  );
}
