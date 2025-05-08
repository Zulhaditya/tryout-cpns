"use-client"

import { useEffect, useState } from "react"

export default function Timer({
  initialTime = 300,
  onTimeUp,
}: {
  initialTime?: number;
  onTimeUp: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-blue-500 text-white p-3 rounded-lg text-center">
      <h3 className="font-bold">Waktu Tersisa</h3>
      <p className="text-2xl">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
}
