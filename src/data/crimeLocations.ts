export interface CrimeLocation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  area: string;
  crimeType: string;
  date: string;
  caseId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
}

export const CRIME_LOCATIONS: CrimeLocation[] = [
  {
    id: 'LOC-001',
    lat: 23.2332,
    lng: 77.4148,
    title: 'Central Market Robbery',
    area: 'MP Nagar',
    crimeType: 'Armed Robbery',
    date: '2026-09-08',
    caseId: 'CR-2026-0142',
    severity: 'HIGH',
    status: 'Active Investigation',
  },
  {
    id: 'LOC-002',
    lat: 23.2185,
    lng: 77.4017,
    title: 'Vehicle Theft — New Market',
    area: 'New Market',
    crimeType: 'Vehicle Theft',
    date: '2026-09-06',
    caseId: 'CR-2026-0138',
    severity: 'MEDIUM',
    status: 'Active',
  },
  {
    id: 'LOC-003',
    lat: 23.2351,
    lng: 77.4383,
    title: 'Habibganj Station Theft',
    area: 'Habibganj',
    crimeType: 'Theft',
    date: '2026-09-02',
    caseId: 'CR-2026-0131',
    severity: 'LOW',
    status: 'Under Review',
  },
  {
    id: 'LOC-004',
    lat: 23.2101,
    lng: 77.4327,
    title: 'Arera Colony Assault',
    area: 'Arera Colony',
    crimeType: 'Assault',
    date: '2026-08-28',
    caseId: 'CR-2026-0119',
    severity: 'HIGH',
    status: 'Active',
  },
  {
    id: 'LOC-005',
    lat: 23.1892,
    lng: 77.4604,
    title: 'Kolar Road Burglary',
    area: 'Kolar Road',
    crimeType: 'Burglary',
    date: '2026-08-20',
    caseId: 'CR-2026-0107',
    severity: 'MEDIUM',
    status: 'Closed',
  },
  {
    id: 'LOC-006',
    lat: 23.2658,
    lng: 77.3721,
    title: 'Bairagarh Chain Snatching',
    area: 'Bairagarh',
    crimeType: 'Chain Snatching',
    date: '2026-08-14',
    caseId: 'CR-2026-0094',
    severity: 'MEDIUM',
    status: 'Active',
  },
  {
    id: 'LOC-007',
    lat: 23.2267,
    lng: 77.4390,
    title: 'MP Nagar Online Fraud',
    area: 'MP Nagar Zone 1',
    crimeType: 'Fraud',
    date: '2026-08-10',
    caseId: 'CR-2026-0088',
    severity: 'LOW',
    status: 'Pending',
  },
];

export const BHOPAL_CENTER: [number, number] = [23.2332, 77.4148];
