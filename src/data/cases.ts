export type CasePriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'CLOSED' | 'PENDING';

export interface Case {
  id: string;
  crimeType: string;
  location: string;
  date: string;
  time: string;
  priority: CasePriority;
  status: CaseStatus;
  officer: string;
  ipcSections: string[];
  summary: string;
  victim: string;
  fir: string;
  evidenceCount: number;
  suspectsCount: number;
}

export const CASES: Case[] = [
  {
    id: 'CR-2026-0142',
    crimeType: 'Armed Robbery',
    location: 'Central Market, MP Nagar, Bhopal',
    date: '2026-09-08',
    time: '20:45',
    priority: 'HIGH',
    status: 'ACTIVE',
    officer: 'R. Deshmukh',
    ipcSections: ['392', '394', '34'],
    summary: 'Armed robbery at Central Market involving two suspects on motorcycle. Victim sustained minor injuries. CCTV footage available. Suspect vehicle identified as black motorcycle MP04AB1234.',
    victim: 'Suresh Kumar Gupta',
    fir: 'FIR-2026-1042',
    evidenceCount: 14,
    suspectsCount: 3,
  },
  {
    id: 'CR-2026-0138',
    crimeType: 'Vehicle Theft',
    location: 'New Market, Bhopal',
    date: '2026-09-06',
    time: '14:20',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    officer: 'P. Sharma',
    ipcSections: ['379', '411'],
    summary: 'Honda City stolen from New Market parking. Vehicle registration MP09CD5678. Owner reported vehicle missing at 6 PM.',
    victim: 'Priya Verma',
    fir: 'FIR-2026-1038',
    evidenceCount: 6,
    suspectsCount: 1,
  },
  {
    id: 'CR-2026-0131',
    crimeType: 'Theft',
    location: 'Habibganj Railway Station, Bhopal',
    date: '2026-09-02',
    time: '09:15',
    priority: 'LOW',
    status: 'UNDER_REVIEW',
    officer: 'A. Singh',
    ipcSections: ['379'],
    summary: 'Wallet and mobile phone stolen from passenger on Platform 3. Suspect identified from station CCTV.',
    victim: 'Ramesh Tiwari',
    fir: 'FIR-2026-1031',
    evidenceCount: 4,
    suspectsCount: 1,
  },
  {
    id: 'CR-2026-0119',
    crimeType: 'Assault',
    location: 'Arera Colony, Bhopal',
    date: '2026-08-28',
    time: '22:30',
    priority: 'HIGH',
    status: 'ACTIVE',
    officer: 'R. Deshmukh',
    ipcSections: ['323', '325', '34'],
    summary: 'Group assault outside convenience store. Three suspects involved. Victim hospitalized with fractures.',
    victim: 'Mohit Jain',
    fir: 'FIR-2026-1019',
    evidenceCount: 9,
    suspectsCount: 4,
  },
  {
    id: 'CR-2026-0107',
    crimeType: 'Burglary',
    location: 'Kolar Road, Bhopal',
    date: '2026-08-20',
    time: '03:00',
    priority: 'MEDIUM',
    status: 'CLOSED',
    officer: 'S. Patel',
    ipcSections: ['457', '380'],
    summary: 'Residential burglary. Suspect apprehended with stolen items. Case closed with charge sheet filed.',
    victim: 'Anita Saxena',
    fir: 'FIR-2026-1007',
    evidenceCount: 11,
    suspectsCount: 2,
  },
  {
    id: 'CR-2026-0094',
    crimeType: 'Chain Snatching',
    location: 'Bairagarh Market, Bhopal',
    date: '2026-08-14',
    time: '16:50',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    officer: 'K. Mishra',
    ipcSections: ['392', '397'],
    summary: 'Gold chain snatched from elderly woman near bus stand. Suspect fled on two-wheeler.',
    victim: 'Savitri Devi',
    fir: 'FIR-2026-0994',
    evidenceCount: 3,
    suspectsCount: 1,
  },
  {
    id: 'CR-2026-0088',
    crimeType: 'Fraud',
    location: 'MP Nagar Zone 1, Bhopal',
    date: '2026-08-10',
    time: '11:00',
    priority: 'LOW',
    status: 'PENDING',
    officer: 'D. Rao',
    ipcSections: ['420', '406'],
    summary: 'Online fraud case involving fake investment scheme. Multiple victims identified.',
    victim: 'Vijay Kulkarni',
    fir: 'FIR-2026-0988',
    evidenceCount: 18,
    suspectsCount: 2,
  },
  {
    id: 'CR-2026-0076',
    crimeType: 'Missing Person',
    location: 'TT Nagar, Bhopal',
    date: '2026-08-05',
    time: '—',
    priority: 'HIGH',
    status: 'ACTIVE',
    officer: 'R. Deshmukh',
    ipcSections: ['363'],
    summary: 'Minor reported missing. Last seen near TT Nagar bus stop. Search ongoing.',
    victim: 'Family of Aryan Pathak (14)',
    fir: 'FIR-2026-0976',
    evidenceCount: 5,
    suspectsCount: 0,
  },
];

export const FLAGSHIP_CASE = CASES[0];

export const CASE_STATS = {
  active: 24,
  evidenceItems: 187,
  personsOfInterest: 38,
  pendingAnalysis: 12,
};

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', cases: 3, evidence: 12, interviews: 5 },
  { day: 'Tue', cases: 5, evidence: 18, interviews: 8 },
  { day: 'Wed', cases: 2, evidence: 9, interviews: 4 },
  { day: 'Thu', cases: 7, evidence: 24, interviews: 11 },
  { day: 'Fri', cases: 4, evidence: 15, interviews: 6 },
  { day: 'Sat', cases: 6, evidence: 21, interviews: 9 },
  { day: 'Sun', cases: 1, evidence: 6, interviews: 2 },
];

export const CASES_BY_STATUS = [
  { name: 'Active', value: 14, fill: '#7c3aed' },
  { name: 'Under Review', value: 5, fill: '#f59e0b' },
  { name: 'Pending', value: 3, fill: '#64748b' },
  { name: 'Closed', value: 2, fill: '#22c55e' },
];

export const EVIDENCE_BREAKDOWN = [
  { type: 'CCTV', count: 48, fill: '#8b5cf6' },
  { type: 'Documents', count: 52, fill: '#06b6d4' },
  { type: 'Audio', count: 23, fill: '#f59e0b' },
  { type: 'Digital', count: 34, fill: '#ec4899' },
  { type: 'Physical', count: 30, fill: '#22c55e' },
];
