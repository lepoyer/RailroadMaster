import React, { useEffect, useRef } from 'react';

interface ControlSidebarProps {
  logs: string[];
}

export default function ControlSidebar({ logs }: ControlSidebarProps) {
  // 💡 콘솔창의 맨 아래 지점을 가리킬 핀(Ref)을 만듭니다.
  const logEndRef = useRef<HTMLDivElement>(null);

  // 💡 logs 배열에 새로운 로그가 추가될 때마다 이 useEffect가 자동으로 실행됩니다.
  useEffect(() => {
    // 맨 아래로 화면을 부드럽게(smooth) 밀어 내립니다.
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-300 p-4 flex flex-col h-full select-none">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">관제 로그 콘솔</h3>
      
      {/* 텍스트 위주의 깨끗한 콘솔 창 */}
      <div className="flex-1 bg-gray-950 text-gray-200 font-mono text-xs p-3 border-gray-800 overflow-y-auto space-y-1.5">
        {logs.map((log, index) => (
          <p key={index} className={log.includes('설정') ? 'text-red-400' : 'text-gray-300'}>
            {log}
          </p>
        ))}
        {logs.length === 0 && <p className="text-gray-600">대기 중...</p>}
        
        {/* 💡 스크롤을 유도하기 위해 콘솔 창 맨 밑바닥에 보이지 않는 나침반 태그를 심어둡니다. */}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}