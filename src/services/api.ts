import { CASES, Case } from '../data/cases';
import { EVIDENCE_LIST, Evidence } from '../data/evidence';
import { PERSONS, Person } from '../data/suspects';
import { TIMELINE_EVENTS, TimelineEvent } from '../data/timeline';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// Simulated network delay
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// Mock service layer — replace fetch calls with real axios calls when API is live
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
