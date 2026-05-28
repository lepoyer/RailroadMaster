import React, { useState, useEffect } from "react";
import TrackMap from "./TrackMap";
import ControlSidebar from "./ControlSidebar";

export default function ControlPanel() {
  const [stationBlocked, setStationBlocked] = useState(false);
  const timeString = new Date().toLocaleTimeString();
  const [logs, setLogs] = useState<string[]>([
    `[${timeString}] 시스템이 정상 가동되었습니다.`,
  ]);

  // 분기기 상태 통합 관리 ('straight': 직진/기본, 'diverge': 분기/진로변경)
  const [switches, setSwitches] = useState<{
    [key: string]: "straight" | "diverge";
  }>({
    "SW-01": "straight",
    "SW-02": "straight",
    "SW-03": "straight",
  });

  // 열차 기본 데이터 세팅
  const [trains, setTrains] = useState([
    {
      id: "1",
      name: "M-01",
      lineId: "top" as "top" | "middle" | "bottom",
      positionX: 2,
      status: "running",
    },
  ]);

  // 💡 [문제 1 최종 해결] 계산 타이밍을 동기화하여 정확한 상태로 1줄만 출력되도록 보정
  const handleToggleSwitch = (switchId: string) => {
    // 1. 클릭하는 순간 현재 상태를 바탕으로 바뀔 방향을 '먼저' 확실하게 연산합니다.
    const currentDir = switches[switchId];
    const determinedNextDir = currentDir === "straight" ? "diverge" : "straight";

    // 2. 확정된 다음 방향을 상태 주머니에 주입합니다.
    setSwitches((prev) => ({
      ...prev,
      [switchId]: determinedNextDir,
    }));

    // 3. 확정된 방향 변수를 바탕으로 로그를 쌓아 StrictMode 중복 실행 시에도 정확히 1줄, 알맞은 진로가 찍히게 만듭니다.
    const currentTime = new Date().toLocaleTimeString();
    const newLog = `[${currentTime}] [분기기] ${switchId} 연동 방향이 [${
      determinedNextDir === "straight" ? "직선" : "측선/분기"
    }]으로 변경되었습니다.`;
    
    setLogs((l) => [...l, newLog]);
  };

  const handleToggleBlock = () => {
    const nextState = !stationBlocked;
    setStationBlocked(nextState);
    const currentTime = new Date().toLocaleTimeString();
    const newLog = nextState
      ? `[${currentTime}] [시청역] '역 진입금지'가 설정되었습니다.`
      : `[${currentTime}] [시청역] '역 진입금지'가 해제되었습니다.`;
    setLogs((prev) => [...prev, newLog]);
  };

  // 🚂 핵심 이동 시뮬레이션 루프 (순수한 원본 로직 유지)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          // 1. 역 제어 블록 기능 작동 조건 체크
          if (
            stationBlocked &&
            train.lineId === "middle" &&
            train.positionX >= 23 &&
            train.positionX < 25
          ) {
            return { ...train, positionX: 25 }; // 시청역 진입 전에 정차대기
          }

          let nextPos = train.positionX + 1;
          let nextLine = train.lineId;

          // 2. 실시간 분기기 진로 유도 제어 로직
          if (train.lineId === "top" && train.positionX === 5) {
            if (switches["SW-01"] === "diverge") {
              nextLine = "middle";
            }
          }

          if (train.lineId === "middle" && train.positionX === 24) {
            if (switches["SW-03"] === "diverge") {
              nextLine = "bottom";
            }
          }

          // 3. 순환 루프 처리
          if (nextPos >= 98) {
            nextPos = 1;
            nextLine = "top";
          }

          return { ...train, positionX: nextPos, lineId: nextLine };
        }),
      );
    }, 200);

    return () => clearInterval(interval);
  }, [stationBlocked, switches]);

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-lg font-black text-gray-800 tracking-tight">
            Desktop Main
          </h1>
        </header>

        <TrackMap
          stationBlocked={stationBlocked}
          onToggleBlock={handleToggleBlock}
          trains={trains}
          switches={switches}
          onToggleSwitch={handleToggleSwitch}
        />
      </div>
      <ControlSidebar logs={logs} />
    </div>
  );
}