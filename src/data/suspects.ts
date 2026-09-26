export type PersonRole = 'PERSON_OF_INTEREST' | 'WITNESS' | 'VICTIM' | 'ASSOCIATE';

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  description?: string;
  connections: string[];
  linkedEvidence: string[];
  caseIds: string[];
  notes?: string;
  status: 'ACTIVE' | 'CLEARED' | 'UNKNOWN';
}

export const PERSONS: Person[] = [
  {
    id: 'P-001',
    name: 'Suspect A (Unidentified)',
    role: 'PERSON_OF_INTEREST',
    age: undefined,
    gender: 'Male',
    address: 'Unknown',
    phone: 'Unknown',
    description: 'Approx. 25–32 years, medium build, wore dark helmet. Riding pillion on motorcycle.',
    connections: ['P-002', 'V-001'],
    linkedEvidence: ['EV-1024', 'EV-1025', 'EV-1026'],
    caseIds: ['CR-2026-0142'],
    notes: 'Primary suspect. Face partially visible in EV-1025. Enhancement underway.',
    status: 'ACTIVE',
  },
  {
    id: 'P-002',
    name: 'Suspect B (Unidentified)',
    role: 'PERSON_OF_INTEREST',
    age: undefined,
    gender: 'Male',
    address: 'Unknown',
    phone: 'Unknown',
    description: 'Approx. 20–28 years, slim build, drove motorcycle MP04AB1234. Dark jacket.',
    connections: ['P-001', 'V-001'],
    linkedEvidence: ['EV-1024', 'EV-1025'],
    caseIds: ['CR-2026-0142'],
    notes: 'Driver of motorcycle. Vehicle registered to Arun Chauhan — relationship being investigated.',
    status: 'ACTIVE',
  },
  {
    id: 'P-003',
    name: 'Arun Chauhan',
    role: 'ASSOCIATE',
    age: 34,
    gender: 'Male',
    address: 'Plot 22, Bairagarh, Bhopal',
    phone: '9826XXXXXX',
    description: 'Registered owner of motorcycle MP04AB1234. Claims vehicle was stolen 2 days prior. Complaint not filed.',
    connections: ['P-001', 'P-002'],
    linkedEvidence: ['EV-1029', 'EV-1031'],
    caseIds: ['CR-2026-0142'],
    notes: 'CDR analysis in progress. Proximity to incident area at 20:30 hrs noted.',
    status: 'ACTIVE',
  },
  {
    id: 'V-001',
    name: 'Suresh Kumar Gupta',
    role: 'VICTIM',
    age: 52,
    gender: 'Male',
    address: 'A-14, MP Nagar Zone 2, Bhopal',
    phone: '9752XXXXXX',
    description: 'Shop owner. Robbed of ₹24,500 cash and gold chain while closing shop.',
    connections: ['P-001', 'P-002', 'W-001'],
    linkedEvidence: ['EV-1025', 'EV-1027', 'EV-1030'],
    caseIds: ['CR-2026-0142'],
    notes: 'Victim cooperating fully. Provided detailed statement.',
    status: 'CLEARED',
  },
  {
    id: 'W-001',
    name: 'Rajesh Kumar',
    role: 'WITNESS',
    age: 38,
    gender: 'Male',
    address: 'B-7, MP Nagar Zone 1, Bhopal',
    phone: '9826XXXXXX',
    description: 'Passerby who witnessed suspects fleeing. Identified motorcycle direction towards Kolar Road.',
    connections: ['V-001'],
    linkedEvidence: ['EV-1026'],
    caseIds: ['CR-2026-0142'],
    notes: 'Reliable eyewitness. Statement corroborated by CCTV.',
    status: 'CLEARED',
  },
  {
    id: 'W-002',
    name: 'Kavita Sharma',
    role: 'WITNESS',
    age: 45,
    gender: 'Female',
    address: 'Shop No. 16, Central Market, Bhopal',
    phone: '9977XXXXXX',
    description: 'Adjacent shopkeeper. Heard commotion and saw suspects from distance.',
    connections: ['V-001'],
    linkedEvidence: ['EV-1027'],
    caseIds: ['CR-2026-0142'],
    notes: 'Limited visibility. Corroborates timeline.',
    status: 'CLEARED',
  },
];

export const NETWORK_NODES = [
  { id: 'P-001', label: 'Suspect A', type: 'suspect', x: 300, y: 200 },
  { id: 'P-002', label: 'Suspect B', type: 'suspect', x: 480, y: 200 },
  { id: 'P-003', label: 'Arun Chauhan', type: 'associate', x: 390, y: 340 },
  { id: 'V-001', label: 'Suresh Gupta\n(Victim)', type: 'victim', x: 180, y: 340 },
  { id: 'W-001', label: 'Rajesh Kumar\n(Witness)', type: 'witness', x: 100, y: 200 },
  { id: 'W-002', label: 'Kavita Sharma\n(Witness)', type: 'witness', x: 580, y: 340 },
  { id: 'VH-001', label: 'MP04AB1234\n(Motorcycle)', type: 'vehicle', x: 600, y: 200 },
  { id: 'LOC-001', label: 'Central Market', type: 'location', x: 390, y: 80 },
];

export const NETWORK_EDGES = [
  { source: 'P-001', target: 'P-002', label: 'co-suspect' },
  { source: 'P-001', target: 'V-001', label: 'robbed' },
  { source: 'P-002', target: 'V-001', label: 'robbed' },
  { source: 'P-002', target: 'VH-001', label: 'drove' },
  { source: 'P-003', target: 'VH-001', label: 'registered owner' },
  { source: 'P-003', target: 'P-002', label: 'associated' },
  { source: 'W-001', target: 'V-001', label: 'witnessed' },
  { source: 'W-002', target: 'V-001', label: 'witnessed' },
  { source: 'P-001', target: 'LOC-001', label: 'present at' },
  { source: 'P-002', target: 'LOC-001', label: 'present at' },
  { source: 'V-001', target: 'LOC-001', label: 'present at' },
  { source: 'W-001', target: 'LOC-001', label: 'near scene' },
];
