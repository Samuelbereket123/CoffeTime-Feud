'use client';

interface ScoreboardProps {
  teamAName?: string;
  teamBName?: string;
  scoreA: number;
  scoreB: number;
  onScoreA: () => void;
  onScoreB: () => void;
}

export default function Scoreboard({ 
  teamAName = 'Team A', 
  teamBName = 'Team B', 
  scoreA, 
  scoreB, 
  onScoreA, 
  onScoreB 
}: ScoreboardProps) {
  return (
    <div className="flex justify-between w-full max-w-4xl mx-auto mb-8">
      <div className="flex-1 text-center">
        <h2 className="text-2xl font-bold text-amber-900">{teamAName}</h2>
        <div className="text-4xl font-bold my-2">{scoreA}</div>
        <button 
          onClick={onScoreA}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          +10 Points
        </button>
      </div>
      
      <div className="flex-1 text-center">
        <h2 className="text-2xl font-bold text-amber-900">{teamBName}</h2>
        <div className="text-4xl font-bold my-2">{scoreB}</div>
        <button 
          onClick={onScoreB}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          +10 Points
        </button>
      </div>
    </div>
  );
}
