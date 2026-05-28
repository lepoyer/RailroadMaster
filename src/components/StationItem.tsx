import React, { useState } from 'react';

interface StationItemProps {
  name: string;
  isBlocked: boolean;
  onToggleBlock: () => void;
}

export default function StationItem({ name, isBlocked, onToggleBlock }: StationItemProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative flex items-center bg-gray-200 border border-gray-400 rounded-full px-29 py-4 shadow-sm">
      {/* 회색 빛의 타원형 역사 명 */}
      <span className="text-sm font-semibold text-gray-800 mr-2">{name}</span>
      
      {/* 역의 상태를 전환할 수 있는 우측 버튼 */}
      <button 
        onClick={() => setShowPopup(true)}
        className={`w-30 h-6 rounded flex items-center justify-center text-xs font-bold border transition-colors ${
          isBlocked ? 'bg-red-500 text-red border-red-600' : 'bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-400'
        }`}
      >
        {isBlocked ? '현재 진입금지 상태' : '현재 진입허용 상태'}
      </button>

      {/* 역 진입 금지 설정 팝업 (모달) */}
      {showPopup && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-400 p-3 rounded shadow-xl z-50 w-48 text-center">
          <p className="text-xs font-bold mb-2 text-gray-700">긴급 역사 진입제어 설정</p>
          <button
            onClick={() => {
              onToggleBlock();
              setShowPopup(false);
            }}
            className={`w-full text-xs py-1 px-2 rounded font-medium text-white mb-2 ${
              isBlocked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-700'
            }`}
          >
            {isBlocked ? '역사 진입 금지 해제' : '역사 진입 금지 설정'}
          </button>
          <button 
            onClick={() => setShowPopup(false)}
            className="w-full text-xs bg-gray-100 hover:bg-gray-300 text-gray-500 py-1 rounded border border-gray-300"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}