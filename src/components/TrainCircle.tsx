import React from "react";

interface TrainCircleProps {
  status: string;
}

export default function TrainCircle({ status }: TrainCircleProps) {
  const statusClass =
    status === "emergency" ? "ring-2 ring-rose-500 animate-pulse" : "";
  const fallbackSvg = encodeURIComponent(
    `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5'><rect x='3' y='5' width='18' height='11' rx='2' ry='2' fill='%23067AFE'/><circle cx='8.5' cy='18.5' r='1' fill='black'/><circle cx='15.5' cy='18.5' r='1' fill='black'/><path d='M7 7h10' stroke='white' stroke-linecap='round'/></svg>`,
  );

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 left-[40%] flex items-center z-10`}
    >
      <img
        src="/train.png"
        alt="train"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `data:image/svg+xml;charset=utf-8,${fallbackSvg}`;
        }}
        className={`w-6 h-6 ${statusClass}`}
      />
    </div>
  );
}
