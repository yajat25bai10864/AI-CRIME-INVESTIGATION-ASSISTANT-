export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  evidenceTags?: string[];
}

export const QUICK_PROMPTS = [
  'Who was present near Central Market after 8 PM?',
  'Show all persons linked to motorcycle MP04AB1234',
  'Summarize witness statements for CR-2026-0142',
  'List all IPC sections and relevant evidence',
  'What is the most recent action in this case?',
  'Which evidence items are still pending analysis?',
];

export const MOCK_RESPONSES: Record<string, { content: string; evidenceTags: string[] }> = {
  default: {
    content: `Based on the available verified case data for CR-2026-0142:

**Persons near Central Market after 20:00 hrs:**
- **Suspect A** (unidentified) — present at approximately 20:43 hrs per CCTV
- **Suspect B** (unidentified) — present at approximately 20:43 hrs per CCTV
- **Suresh Kumar Gupta** (victim) — closing shop at approx. 20:45 hrs
- **Rajesh Kumar** (witness) — departing nearby shop at approx. 20:30 hrs
- **Kavita Sharma** (witness) — in adjacent shop until ~21:00 hrs

*Source: CCTV analysis [EV-1024], [EV-1025], witness statement [EV-1026]*

⚠️ **Verification required**: All AI-generated findings must be cross-checked against source evidence before operational use.`,
    evidenceTags: ['EV-1024', 'EV-1025', 'EV-1026'],
  },
  motorcycle: {
    content: `**Persons linked to motorcycle MP04AB1234:**

1. **Suspect B** (unidentified) — drove the vehicle during the incident [EV-1024], [EV-1025]
2. **Suspect A** (unidentified) — pillion rider [EV-1024]
3. **Arun Chauhan** — registered owner of the vehicle. Claims theft but no complaint filed. CDR being analyzed [EV-1031]

**Vehicle trace:**
- 20:30 hrs — observed at MP Nagar Chowk [EV-1024]
- 21:15 hrs — recorded at NH-12 Toll Plaza [EV-1029]

*Note: Vehicle registration cross-referenced with MP Transport database.*

⚠️ **Verification required**: Confirm vehicle ownership and CDR links through official channels.`,
    evidenceTags: ['EV-1024', 'EV-1025', 'EV-1029', 'EV-1031'],
  },
  witness: {
    content: `**Witness Statement Summary — CR-2026-0142:**

**Rajesh Kumar** [EV-1026]:
- Observed two suspects on black motorcycle at ~20:30 hrs
- Plate begins "MP 04" — corroborates CCTV
- Suspects fled towards Kolar Road
- Suspect 1: Male, ~25–30 yrs, no helmet, medium height

**Kavita Sharma** [EV-1027]:
- Heard commotion from adjacent shop
- Did not see suspects clearly
- Confirms timing of incident (~20:45 hrs)

*Both statements are audio-recorded and transcript-verified.*

⚠️ **Verification required**: All witness accounts must be treated as unverified until formally corroborated.`,
    evidenceTags: ['EV-1026', 'EV-1027'],
  },
};
