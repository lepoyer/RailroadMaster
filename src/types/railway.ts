export interface Train {
  id: string;
  name: string;
  lineId: 'top' | 'middle' | 'bottom'; // 어느 노반에 있는지
  positionX: number; // 좌측에서부터의 위치 (%)
  status: 'running' | 'stopped' | 'emergency';
}

// 분기기 상태 정의 ('straight': 직진, 'diverge': 측선/분기 방향)
export interface SwitchState {
  id: string;
  direction: 'straight' | 'diverge';
}

export interface Station {
  id: string;
  name: string;
  isBlocked: boolean; // 역 진입 금지 상태 여부
}