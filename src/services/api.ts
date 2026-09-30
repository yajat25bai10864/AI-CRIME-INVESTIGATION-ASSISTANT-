import { CASES, Case } from '../data/cases';
import { EVIDENCE_LIST, Evidence } from '../data/evidence';
import { PERSONS, Person } from '../data/suspects';
import { TIMELINE_EVENTS, TimelineEvent } from '../data/timeline';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// Simulated network delay
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const API_KEY = import.meta.env.VITE_API_KEY ?? 'change-me';

export interface FIRAnalyzeResponse {
  fir: {
    case_id: string;
    crime_type: string;
    victim_details: {
      name: string | null;
      age: number | null;
      gender: string | null;
    }[];
    suspect_details: {
      name: string | null;
      age: number | null;
      gender: string | null;
      description: string | null;
    }[];
    incident_date: string | null;
    location: {
      latitude: number | null;
      longitude: number | null;
      address: string | null;
    };
    ipc_sections: string[];
    raw_text: string;
    keywords: string[];
  };
  suspect_ids: string[];
  duplicate_warning: string | null;
};

export interface CaseGraphResponse {
  case_id: string;
  nodes: {
    id: string;
    label: string;
    type: string;
    age?: number;
    address?: string | null;
    priority_score?: number | null;
    degree_centrality?: number;
    betweenness?: number;
    val?: number;
  }[];
  links: {
    source: string;
    target: string;
    label: string;
  }[];
  stats: {
    node_count: number;
    edge_count: number;
    connected_components: number;
    most_connected: string | null;
  };
}

export const getCaseEvidence = async (caseId: string) => {
  const response = await fetch(`${BASE_URL}/evidence/${encodeURIComponent(caseId)}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch evidence (${response.status})`);
  }

  return response.json();
};

export const getCaseGraph = async (caseId: string): Promise<CaseGraphResponse> => {
  const response = await fetch(`${BASE_URL}/graph/${encodeURIComponent(caseId)}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch case graph (${response.status})`);
  }

  return response.json();
};

export const getFIRById = async (caseId: string): Promise<FIRAnalyzeResponse['fir']> => {
  const response = await fetch(`${BASE_URL}/fir/${encodeURIComponent(caseId)}`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch FIR (${response.status})`);
  }

  return response.json();
};

export const listFIRs = async (): Promise<FIRAnalyzeResponse['fir'][]> => {
  const response = await fetch(`${BASE_URL}/fir`, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch FIRs (${response.status})`);
  }

  return response.json();
};

export const analyzeFIRFile = async (file: File): Promise<FIRAnalyzeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/fir/analyze`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `FIR file analysis failed (${response.status})`);
  }

  return response.json();
};

export const analyzeFIRText = async (text: string): Promise<FIRAnalyzeResponse> => {
  const response = await fetch(`${BASE_URL}/fir/analyze`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `FIR analysis failed (${response.status})`);
  }

  return response.json();
};

// Mock service layer — replace fetch calls with real axios calls when API is live

export interface CrimeHeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
  incident_count: number;
  crime_types: Record<string, number>;
}

export interface CrimeHeatmapResponse {
  points: CrimeHeatmapPoint[];
  leaflet_heat: number[][];
  total_incidents: number;
  filters: {
    crime_type: string | null;
    date_from: string | null;
    date_to: string | null;
    grid_precision: number;
  };
}

export const getCrimeHeatmap = async (): Promise<CrimeHeatmapResponse> => {
  const response = await fetch(`${BASE_URL}/analytics/heatmap`, {
    headers: { 'X-API-Key': API_KEY },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Failed to fetch crime heatmap (${response.status})`);
  }

  return response.json();
};

export const api = {
  baseUrl: BASE_URL,

  cases: {
    list: async (): Promise<Case[]> => {
      await delay();
      return CASES;
    },
    getById: async (id: string): Promise<Case | undefined> => {
      await delay();
      return CASES.find((c) => c.id === id);
    },
  },

  evidence: {
    list: async (caseId?: string): Promise<Evidence[]> => {
      await delay();
      return caseId ? EVIDENCE_LIST.filter((e) => e.caseId === caseId) : EVIDENCE_LIST;
    },
    getById: async (id: string): Promise<Evidence | undefined> => {
      await delay();
      return EVIDENCE_LIST.find((e) => e.id === id);
    },
  },

  persons: {
    list: async (caseId?: string): Promise<Person[]> => {
      await delay();
      return caseId ? PERSONS.filter((p) => p.caseIds.includes(caseId)) : PERSONS;
    },
    getById: async (id: string): Promise<Person | undefined> => {
      await delay();
      return PERSONS.find((p) => p.id === id);
    },
  },

  timeline: {
    list: async (caseId?: string): Promise<TimelineEvent[]> => {
      await delay();
      if (!caseId) return TIMELINE_EVENTS;
      return TIMELINE_EVENTS; // all events belong to flagship case
    },
  },

  chat: {
    query: async (message: string, _caseId: string): Promise<string> => {
      await delay(1200);
      const lower = message.toLowerCase();
      if (lower.includes('motorcycle') || lower.includes('vehicle')) {
        return 'motorcycle';
      }
      if (lower.includes('witness') || lower.includes('statement')) {
        return 'witness';
      }
      return 'default';
    },
  },
};
