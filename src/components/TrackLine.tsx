import React from "react";
import TrainCircle from "./TrainCircle";
import StationItem from "./StationItem";

export default function TrackLine() {
  return (
    <div className="relative w-full h-24 bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center">
      <div className="absolute left-6 text-xs font-semibold text-slate-500 tracking-wider">
        A-LINE
      </div>

      {/* 실제 철도 선로 (-) */}
      <div className="relative w-full h-1.5 bg-slate-700 mx-20 rounded-full">
        {/* 선로 위 역들 */}
        <StationItem name="서울역" leftPosition="10%" />
        <StationItem name="천안아산역" leftPosition="50%" />
        <StationItem name="대전역" leftPosition="90%" />

        {/* 선로 위 열차 아이콘 */}
        <TrainCircle status="running" />
      </div>
    </div>
  );
}
