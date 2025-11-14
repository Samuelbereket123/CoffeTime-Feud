'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

export default function Timer({ initialTime, onTimeUp, isPaused }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onTimeUp]);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  // Calculate progress percentage
  const progress = (timeLeft / initialTime) * 100;
  
  // Determine color based on time left
  let timerColor = 'bg-green-500';
  if (timeLeft < initialTime * 0.6) timerColor = 'bg-yellow-500';
  if (timeLeft < initialTime * 0.3) timerColor = 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
      <div 
        className={`h-full rounded-full ${timerColor} transition-all duration-1000 ease-linear`}
        style={{ width: `${progress}%` }}
      ></div>
      <div className="text-center mt-2 text-lg font-medium text-amber-900">
        {timeLeft}s
      </div>
    </div>
  );
}
