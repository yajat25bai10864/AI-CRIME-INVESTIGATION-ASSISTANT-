export type EvidenceCategory = 'CCTV' | 'Audio' | 'Document' | 'Image' | 'Digital';
export type CustodyStatus = 'VERIFIED' | 'PENDING' | 'IN_ANALYSIS';

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  category: EvidenceCategory;
  date: string;
  time: string;
  location: string;
  collectedBy: string;
  custodyStatus: CustodyStatus;
  description: string;
  tags: string[];
  fileType: string;
  size: string;
  aiAnalyzed: boolean;
  confidence?: number;
  notes?: string;
}

export const EVIDENCE_LIST: Evidence[] = [
  {
    id: 'EV-1024',
    caseId: 'CR-2026-0142',
    title: 'CCTV Footage - MP Nagar Chowk',
    category: 'CCTV',
    date: '2026-09-08',
    time: '20:43',
    location: 'MP Nagar Chowk Camera #7',
    collectedBy: 'R. Deshmukh',
    custodyStatus: 'VERIFIED',
    description: 'High-resolution CCTV recording showing two suspects approaching Central Market on motorcycle. Vehicle plate partially visible: MP04AB1234.',
    tags: ['motorcycle', 'suspect', 'vehicle-plate', 'entry-route'],
    fileType: 'MP4',
    size: '2.3 GB',
    aiAnalyzed: true,
    confidence: 94,
    notes: 'AI identified 2 persons and 1 vehicle. Plate confirmed by traffic database cross-reference.',
  },
  {
    id: 'EV-1025',
    caseId: 'CR-2026-0142',
    title: 'Shop CCTV - Central Market Interior',
    category: 'CCTV',
    date: '2026-09-08',
    time: '20:45',
    location: 'Central Market Shop No. 14',
    collectedBy: 'P. Sharma',
    custodyStatus: 'VERIFIED',
    description: 'Interior CCTV showing robbery in progress. Both suspects visible. Victim Suresh Kumar Gupta present.',
    tags: ['robbery', 'suspect-face', 'victim', 'weapon'],
    fileType: 'AVI',
    size: '1.1 GB',
    aiAnalyzed: true,
    confidence: 87,
    notes: 'Suspect 1 face visible for ~3 seconds. Enhancement processing underway.',
  },
  {
    id: 'EV-1026',
    caseId: 'CR-2026-0142',
    title: 'Witness Audio Statement - Rajesh Kumar',
    category: 'Audio',
    date: '2026-09-09',
    time: '11:30',
    location: 'MP Nagar Police Station',
    collectedBy: 'A. Singh',
    custodyStatus: 'VERIFIED',
    description: 'Audio deposition of eyewitness Rajesh Kumar who observed suspects fleeing the scene.',
    tags: ['witness', 'eyewitness', 'suspect-description', 'escape-route'],
    fileType: 'WAV',
    size: '18.4 MB',
    aiAnalyzed: true,
    confidence: 91,
    notes: 'Transcription complete. Key entities extracted: 2 suspects, black motorcycle, direction towards Kolar Road.',
  },
  {
    id: 'EV-1027',
    caseId: 'CR-2026-0142',
    title: 'FIR Document - Suresh Kumar Gupta',
    category: 'Document',
    date: '2026-09-08',
    time: '22:10',
    location: 'MP Nagar Police Station',
    collectedBy: 'R. Deshmukh',
    custodyStatus: 'VERIFIED',
    description: 'Original FIR filed by victim Suresh Kumar Gupta. IPC 392, 394 registered.',
    tags: ['fir', 'victim-statement', 'ipc-392', 'ipc-394'],
    fileType: 'PDF',
    size: '420 KB',
    aiAnalyzed: true,
    confidence: 99,
    notes: 'FIR analyzed. All key entities extracted and structured.',
  },
  {
    id: 'EV-1028',
    caseId: 'CR-2026-0142',
    title: 'Scene Photograph - Central Market',
    category: 'Image',
    date: '2026-09-08',
    time: '23:00',
    location: 'Central Market, MP Nagar',
    collectedBy: 'Forensics Team',
    custodyStatus: 'VERIFIED',
    description: 'Crime scene photographs showing victim\'s position, scattered items, and blood traces.',
    tags: ['scene', 'physical-evidence', 'blood-traces', 'position'],
    fileType: 'JPG',
    size: '14.2 MB',
    aiAnalyzed: false,
    notes: 'Awaiting forensic photo analysis.',
  },
  {
    id: 'EV-1029',
    caseId: 'CR-2026-0142',
    title: 'Vehicle Toll Record - MP04AB1234',
    category: 'Digital',
    date: '2026-09-08',
    time: '21:15',
    location: 'NH-12 Toll Plaza, Bhopal',
    collectedBy: 'D. Rao',
    custodyStatus: 'PENDING',
    description: 'Toll collection digital record showing motorcycle MP04AB1234 crossing NH-12 after incident.',
    tags: ['vehicle', 'toll', 'escape-route', 'timestamp'],
    fileType: 'CSV',
    size: '2 KB',
    aiAnalyzed: false,
    notes: 'Request for full toll records pending.',
  },
  {
    id: 'EV-1030',
    caseId: 'CR-2026-0142',
    title: 'Medical Report - Victim Injuries',
    category: 'Document',
    date: '2026-09-09',
    time: '08:00',
    location: 'Hamidia Hospital, Bhopal',
    collectedBy: 'A. Singh',
    custodyStatus: 'VERIFIED',
    description: 'Medical examination report for Suresh Kumar Gupta. Minor lacerations on forearm and bruising.',
    tags: ['victim', 'medical', 'injuries'],
    fileType: 'PDF',
    size: '156 KB',
    aiAnalyzed: false,
    notes: '',
  },
  {
    id: 'EV-1031',
    caseId: 'CR-2026-0142',
    title: 'Call Records - Suspect Phone',
    category: 'Digital',
    date: '2026-09-10',
    time: '14:00',
    location: 'BSNL Database',
    collectedBy: 'R. Deshmukh',
    custodyStatus: 'IN_ANALYSIS',
    description: 'CDR for number 9826XXXXXX obtained with magistrate order. Analysis in progress.',
    tags: ['cdr', 'phone', 'suspect', 'network'],
    fileType: 'XLS',
    size: '340 KB',
    aiAnalyzed: false,
    notes: 'Pattern analysis pending — cyber cell.',
  },
];
