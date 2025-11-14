'use client';

import { useState, useEffect, useCallback } from 'react';
import { questions as initialQuestions, Question } from '../data/questions';
import Scoreboard from '../components/Scoreboard';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import AddQuestionForm from '../components/AddQuestionForm';

// Save questions to localStorage
const saveQuestions = (questions: Question[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('coffeeFeudQuestions', JSON.stringify(questions));
  }
};

// Load questions from localStorage or use initial questions
const loadQuestions = (): Question[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('coffeeFeudQuestions');
  if (!saved) return [];
  
  // Parse and ensure all questions have the required fields
  const parsed = JSON.parse(saved);
  return parsed.map((question: any) => ({
    ...question,
    difficulty: question.difficulty || 'Medium',
    timeLimit: question.timeLimit || 30
  }));
};

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Handle adding a new question
  const handleAddQuestion = useCallback((newQuestion: Omit<Question, 'id'>) => {
    const questionWithId = { ...newQuestion, id: Date.now().toString() };
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, questionWithId];
      saveQuestions(updatedQuestions);
      
      // If the new question matches the current category, update filtered questions
      if (selectedCategory === 'All' || newQuestion.category === selectedCategory) {
        setFilteredQuestions(prev => [...prev, questionWithId]);
      }
      
      return updatedQuestions;
    });
  }, [selectedCategory]);

  // Load questions from localStorage on component mount
  useEffect(() => {
    const loadedQuestions = loadQuestions();
    setQuestions(loadedQuestions);
    setFilteredQuestions(loadedQuestions);
    setIsLoading(false);
    
    // If no questions exist, show the add question form
    if (loadedQuestions.length === 0) {
      setShowAddQuestion(true);
    }
  }, []);

  // Set filtered questions to all questions (no category filtering)
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const allAnswersRevealed = currentQuestion && 
    revealedIndices.length === currentQuestion.answers.length;
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setTimeUp(true);
    // Auto-reveal all answers when time is up
    if (currentQuestion) {
      setRevealedIndices(currentQuestion.answers.map((_, index) => index));
    }
  }, [currentQuestion]);

  // Reset timer state when question changes
  useEffect(() => {
    setTimeUp(false);
    setIsPaused(false);
  }, [currentQuestionIndex]);

  const handleReveal = (index: number) => {
    if (!revealedIndices.includes(index)) {
      setRevealedIndices([...revealedIndices, index]);
      // Play reveal sound
      const audio = new Audio('/reveal.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setGameOver(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRevealedIndices([]);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setRevealedIndices([]);
    setTeamAScore(0);
    setTeamBScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (showAddQuestion) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Question</h1>
            <p className="text-gray-600">Fill in the details below to add a new question to the game</p>
          </div>
          
          <div className="mb-8">
            <AddQuestionForm 
              onAddQuestion={handleAddQuestion} 
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowAddQuestion(false)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              ← Back to Game
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Coffee Time Feud!</h1>
          <p className="text-gray-600 mb-8">Get started by adding your first question.</p>
          <AddQuestionForm 
            onAddQuestion={handleAddQuestion} 
          />
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl border border-amber-100">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">☕</span>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent mb-4">
              Coffee Time Feud
            </h1>
            <p className="text-lg text-black max-w-lg mx-auto font-medium">
              A fun, fast-paced game where you guess the top answers to coffee and morning-related questions!
            </p>
          </div>
          
          <div className="text-center">
            <button
              onClick={startGame}
              disabled={filteredQuestions.length === 0}
              className={`relative overflow-hidden w-full max-w-xs mx-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {filteredQuestions.length === 0 ? (
                  'No Questions Available'
                ) : (
                  'Start Game'
                )}
              </span>
              {filteredQuestions.length > 0 && (
                <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
              )}
            </button>
            
            <div className="mt-8 space-y-4">
              <button
                onClick={() => setShowAddQuestion(true)}
                className="w-full max-w-xs mx-auto px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Custom Question
              </button>
              <p className="text-sm text-gray-600">
                Made with <span className="text-amber-800">☕</span> and <span className="text-red-600">❤️</span> for coffee lovers
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (gameOver) {
    const winner = teamAScore > teamBScore ? 'Team A' : teamBScore > teamAScore ? 'Team B' : 'Tie';
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-amber-800 mb-8">Game Over!</h1>
          <h2 className="text-3xl text-amber-900 mb-8">
            {winner === 'Tie' 
              ? "It's a tie!" 
              : `${winner} wins with ${winner === 'Team A' ? teamAScore : teamBScore} points!`}
          </h2>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-amber-800">Team A</h3>
              <p className="text-4xl font-bold">{teamAScore}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-amber-800">Team B</h3>
              <p className="text-4xl font-bold">{teamBScore}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetGame}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xl font-bold py-3 px-6 rounded-full transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                resetGame();
                setGameStarted(false);
              }}
              className="bg-white hover:bg-gray-100 text-amber-800 border-2 border-amber-800 text-xl font-bold py-3 px-6 rounded-full transition-colors"
            >
              Change Category
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-800 mb-4">No Questions Available</h1>
          <p className="text-lg text-amber-900 mb-6">There are no questions in the selected category.</p>
          <button
            onClick={() => {
              resetGame();
              setGameStarted(false);
            }}
            className="bg-amber-700 hover:bg-amber-800 text-white text-lg font-bold py-2 px-6 rounded-full transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
              ☕ Coffee Time Feud
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                {currentQuestion.category}
              </span>
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium rounded-full">
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-amber-900">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </p>
            <p className="text-sm text-amber-700">
              {revealedIndices.length} / {currentQuestion.answers.length} answers revealed
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <Timer 
            initialTime={currentQuestion.timeLimit} 
            onTimeUp={handleTimeUp}
            isPaused={isPaused || allAnswersRevealed}
          />
        </div>
        
        <Scoreboard 
          scoreA={teamAScore}
          scoreB={teamBScore}
          onScoreA={() => setTeamAScore(teamAScore + 10)}
          onScoreB={() => setTeamBScore(teamBScore + 10)}
        />

        <div className="my-6">
          <QuestionCard 
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            revealedIndices={revealedIndices}
            onReveal={handleReveal}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-6 py-2 rounded-lg font-medium ${
              isPaused 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={() => {
              setRevealedIndices(currentQuestion.answers.map((_, i) => i));
              setIsPaused(true);
            }}
            disabled={allAnswersRevealed}
            className={`px-6 py-2 rounded-lg font-medium ${
              allAnswersRevealed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Reveal All
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={!allAnswersRevealed && !timeUp}
            className={`px-6 py-2 rounded-lg font-medium ${
              allAnswersRevealed || timeUp
                ? 'bg-amber-700 hover:bg-amber-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
          
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Reset Game
          </button>
        </div>
      </div>
    </main>
  );
}
