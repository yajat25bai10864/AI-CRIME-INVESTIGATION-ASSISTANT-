export interface CCTVEvent {
  timestamp: string;
  type: 'PERSON' | 'VEHICLE' | 'PLATE' | 'EVENT';
  description: string;
  confidence: number;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface CCTVDetection {
  label: string;
  type: 'person' | 'vehicle' | 'plate';
  confidence: number;
  color: string;
}

export const CCTV_DETECTIONS: CCTVDetection[] = [
  { label: 'Vehicle — MP04AB1234', type: 'vehicle', confidence: 94, color: '#f59e0b' },
  { label: 'Suspect A', type: 'person', confidence: 78, color: '#ef4444' },
  { label: 'Suspect B', type: 'person', confidence: 82, color: '#ef4444' },
  { label: 'Motorcycle (Black)', type: 'vehicle', confidence: 97, color: '#f59e0b' },
];

export const CCTV_STATS = {
  people: 14,
  vehicles: 6,
  plates: 4,
  events: 8,
};

export const CCTV_EVENTS: CCTVEvent[] = [
  { timestamp: '20:28:14', type: 'VEHICLE', description: 'Black motorcycle enters MP Nagar Chowk frame', confidence: 97 },
  { timestamp: '20:29:02', type: 'PLATE', description: 'Partial plate MP04AB12** readable', confidence: 81 },
  { timestamp: '20:30:45', type: 'PERSON', description: 'Pillion rider adjusts clothing — possible weapon concealment', confidence: 73 },
  { timestamp: '20:43:11', type: 'VEHICLE', description: 'Motorcycle stops near Central Market entry', confidence: 95 },
  { timestamp: '20:44:58', type: 'PERSON', description: 'Two persons dismount motorcycle', confidence: 91 },
  { timestamp: '20:45:33', type: 'EVENT', description: 'Altercation detected — rapid movement near shop', confidence: 88 },
  { timestamp: '20:47:02', type: 'EVENT', description: 'Both persons remount motorcycle — rapid departure', confidence: 94 },
  { timestamp: '20:47:15', type: 'VEHICLE', description: 'Motorcycle exits towards Kolar Road direction', confidence: 96 },
];
