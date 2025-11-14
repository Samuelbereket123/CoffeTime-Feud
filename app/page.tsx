'use client';

import { useState, useEffect, useCallback } from 'react';
import { questions, categories, Question } from '../data/questions';
import Scoreboard from '../components/Scoreboard';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);
  const [isPaused, setIsPaused] = useState(false);

  // Filter questions by selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === selectedCategory));
    }
    setCurrentQuestionIndex(0);
    setRevealedIndices([]);
  }, [selectedCategory]);

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

  if (!gameStarted) {
    return (
      <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-amber-800 mb-6">☕ Coffee Time Feud</h1>
          <p className="text-xl text-amber-900 mb-8">A fun family feud style game all about coffee and morning routines!</p>
          
          <div className="mb-8 text-left">
            <label className="block text-lg font-medium text-amber-900 mb-2">Select Category:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-amber-700">
              {filteredQuestions.length} questions available in this category
            </p>
          </div>
          
          <button
            onClick={startGame}
            disabled={filteredQuestions.length === 0}
            className={`text-2xl font-bold py-4 px-8 rounded-full transition-colors shadow-lg ${
              filteredQuestions.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
            }`}
          >
            {filteredQuestions.length === 0 ? 'No Questions Available' : 'Start Game'}
          </button>
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
