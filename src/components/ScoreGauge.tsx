"use client";

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#eab308";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#27272a"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="animate-gauge transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-lg font-semibold text-zinc-400">{grade}</span>
        </div>
      </div>
    </div>
  );
}
