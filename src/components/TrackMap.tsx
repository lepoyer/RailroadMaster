import React from "react";
import StationItem from "./StationItem";

interface TrackMapProps {
  stationBlocked: boolean;
  onToggleBlock: () => void;
  trains: any[];
  switches: { [key: string]: "straight" | "diverge" };
  onToggleSwitch: (switchId: string) => void;
}

export default function TrackMap({
  stationBlocked,
  onToggleBlock,
  trains,
  switches,
  onToggleSwitch,
}: TrackMapProps) {
  // SVG 전체의 기준 가로/세로 크기 (비율 기반)
  const width = 1000;
  const height = 500;

  return (
    <div className="flex-1 bg-white border border-gray-300 p-6 min-h-[550px] relative select-none">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        Track Monitor Canvas (SVG)
      </h2>

      {/* 🗺️ 선로 및 기하 구조 그리기 영역 */}
      <div className="w-full relative h-[450px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{ stroke: "#222222", strokeWidth: "1.5", fill: "none" }}
        >
          {/* 1. 최상단 직선 레일 (상선) */}
          <line x1="0" y1="50" x2="1000" y2="50" />

          {/* 2. 상선 왼쪽 분기선 (대각선 두 개) */}
          <line x1="50" y1="50" x2="80" y2="150" />
          <line x1="200" y1="50" x2="150" y2="150" />

          {/* 3. 두 번째 직선 레일 (상선 하부선 - 이미지의 위쪽 초록색 직선) */}
          <line x1="0" y1="150" x2="1000" y2="150" />

          {/* 4. 중앙 시청역 대피선 (위아래로 갈라지는 마름모 구조) */}
          {/* 위로 갈라지는 선 (이미지의 아래쪽 초록색 꺾인 레일) */}
          <line x1="250" y1="150" x2="300" y2="210" />
          <line x1="300" y1="210" x2="700" y2="210" />
          <line x1="700" y1="210" x2="750" y2="150" />

          {/* 아래로 갈라지는 선 (이미지의 보라색 꺾인 레일) */}
          <line x1="250" y1="350" x2="300" y2="290" />
          <line x1="300" y1="290" x2="700" y2="290" />
          <line x1="700" y1="290" x2="750" y2="350" />

          {/* 5. 세 번째 직선 레일 (하선 상부선) */}
          <line x1="0" y1="350" x2="1000" y2="350" />

          {/* 6. 하선 왼쪽 및 오른쪽 교차 분기선 (대각선들) */}
          <line x1="250" y1="350" x2="150" y2="470" />
          <line x1="330" y1="350" x2="390" y2="470" />
          <line x1="850" y1="350" x2="910" y2="470" />

          {/* 7. 최하단 직선 레일 (하선) */}
          <line x1="0" y1="470" x2="1000" y2="470" />
        </svg>

        {/* 🎛️ 분기기 제어 버튼 시스템 */}

        {/* [SW-01] 상선 왼쪽 분기점 */}
        <button
          onClick={() => onToggleSwitch("SW-01")}
          className="absolute w-5 h-5 rounded-full border-2 border-black font-bold text-[9px] flex items-center justify-center cursor-pointer transition-colors z-40"
          style={{
            left: "5%",
            top: "11%",
            transform: "translate(-50%, -50%)",
            backgroundColor:
              switches["SW-01"] === "straight" ? "#ffffff" : "#4ade80",
          }}
        >
          {switches["SW-01"] === "straight" ? "↑" : "↓"}
        </button>

        {/* [SW-02] 시청역 진입 분기점 */}
        <button
          onClick={() => onToggleSwitch("SW-02")}
          className="absolute w-5 h-5 rounded-full border-2 border-black font-bold text-[9px] flex items-center justify-center cursor-pointer transition-colors z-40"
          style={{
            left: "25%",
            top: "29%",
            transform: "translate(-50%, -50%)",
            backgroundColor:
              switches["SW-02"] === "straight" ? "#ffffff" : "#4ade80",
          }}
        >
          {switches["SW-02"] === "straight" ? "↑" : "↓"}
        </button>

        {/* [SW-03] 하선 분기점 */}
        <button
          onClick={() => onToggleSwitch("SW-03")}
          className="absolute w-5 h-5 rounded-full border-2 border-black font-bold text-[9px] flex items-center justify-center cursor-pointer transition-colors z-40"
          style={{
            left: "24%",
            top: "64%",
            transform: "translate(-50%, -50%)",
            backgroundColor:
              switches["SW-03"] === "straight" ? "#ffffff" : "#4ade80",
          }}
        >
          {switches["SW-03"] === "straight" ? "↓" : "↑"}
        </button>

        {/* 🏢 중앙 시청역 컴포넌트: 대피선 정중앙(Y축 50% 지점)에 확실히 고정 */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: "50%", top: "50%" }}
        >
          <StationItem
            name="시청역"
            isBlocked={stationBlocked}
            onToggleBlock={onToggleBlock}
          />
        </div>

        {/* 🚇 실시간 열차 렌더링 (Y축 진로 스위칭 완전 보정본) */}
        {trains.map((train) => {
          let topPosition = "50%";

          if (train.lineId === "top") {
            topPosition = "10%"; // 최상단 직선 레일 (상선)
          } else if (train.lineId === "middle") {
            // 💡 SW-02 조작 시 시청역 위쪽의 두 초록색 선로 사이에서만 움직이도록 고정
            if (train.positionX >= 25 && train.positionX <= 75) {
              // straight(⇈)일 때: 위쪽 초록색 직선 본선 레일 (Y: 150 -> 30%)
              // diverge(⇊)일 때: 아래쪽 초록색 꺾인 대피선 레일 (Y: 210 -> 42%)
              topPosition = switches["SW-02"] === "straight" ? "30%" : "42%";
            } else {
              topPosition = "30%"; // 시청역 진입 전/후 공통 초록색 구간 (Y: 150 -> 30%)
            }
          } else if (train.lineId === "bottom") {
            if (train.positionX >= 25) {
              topPosition = "94%"; // 최하단 직선 레일 (하선)
            } else {
              topPosition = "70%"; // 하선 상부선 레일
            }
          }

          return (
            <div
              key={train.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 z-30"
              style={{ left: `${train.positionX}%`, top: topPosition }}
            >
              <div className="flex items-center justify-center bg-white border-2 border-black rounded-xl p-1 shadow-sm">
                <img
                  src="/train.png"
                  alt="train"
                  className="w-8 h-8"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect x=%2210%22 y=%2218%22 width=%2244%22 height=%2222%22 rx=%226%22 ry=%226%22 fill=%22007aff%22 stroke=%22white%22 stroke-width=%222%22/%3E%3Crect x=%2214%22 y=%2222%22 width=%228%22 height=%228%22 fill=%22white%22/%3E%3Crect x=%2226%22 y=%2222%22 width=%228%22 height=%228%22 fill=%22white%22/%3E%3Crect x=%2238%22 y=%2222%22 width=%228%22 height=%228%22 fill=%22white%22/%3E%3Ccircle cx=%2220%22 cy=%2244%22 r=%226%22 fill=%22303030%22/%3E%3Ccircle cx=%2244%22 cy=%2244%22 r=%226%22 fill=%22303030%22/%3E%3Crect x=%2254%22 y=%2226%22 width=%226%22 height=%228%22 fill=%22white%22/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
