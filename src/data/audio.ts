export interface TranscriptSegment {
  start: string;
  end: string;
  speaker: string;
  text: string;
}

export interface ExtractedEntity {
  type: 'PERSON' | 'LOCATION' | 'TIME' | 'VEHICLE' | 'OBJECT';
  value: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const AUDIO_STATEMENT = {
  id: 'AUD-1026',
  evidenceId: 'EV-1026',
  witness: 'Rajesh Kumar',
  duration: '04:32',
  recordedAt: '2026-09-09 11:30',
  officer: 'A. Singh',
  language: 'Hindi',
  transcript: `Officer Singh: Aapka naam aur address bataiye.
Rajesh Kumar: Ji, mera naam Rajesh Kumar hai, main B-7, MP Nagar Zone 1 mein rehta hun.

Officer Singh: Aap 8 September ki raat Central Market ke paas the?
Rajesh Kumar: Haan sahab, main apni dukaan band karke nikal raha tha, karib saade aath baj rahe the.

Officer Singh: Kya aapne kuch unusual dekha?
Rajesh Kumar: Haan sahab, ek kali motorcycle thi, uspe do log the. Dono ne kala kapra pehna hua tha. Unhone ek bade bhai ki dukaan ke paas ruke, phir achanak kuch hua aur woh bhag gaye Kolar Road ki taraf.

Officer Singh: Motorcycle ka number yaad hai?
Rajesh Kumar: Poora nahi, par MP 04 se shuru hota tha, itna pakka yaad hai. Kafi tez chala gaya.

Officer Singh: Suspects ka chehra dekha?
Rajesh Kumar: Ek ka helmet tha, doosre ka aadha tha — jawaan lag raha tha, 25-30 saal. Medium height.`,
};

export const TRANSCRIPT_SEGMENTS: TranscriptSegment[] = [
  { start: '0:00', end: '0:18', speaker: 'Officer', text: 'Aapka naam aur address bataiye.' },
  { start: '0:18', end: '0:45', speaker: 'Witness', text: 'Ji, mera naam Rajesh Kumar hai, main B-7, MP Nagar Zone 1 mein rehta hun.' },
  { start: '0:45', end: '1:02', speaker: 'Officer', text: 'Aap 8 September ki raat Central Market ke paas the?' },
  { start: '1:02', end: '1:38', speaker: 'Witness', text: 'Haan sahab, main apni dukaan band karke nikal raha tha, karib saade aath baj rahe the.' },
  { start: '1:38', end: '2:05', speaker: 'Officer', text: 'Kya aapne kuch unusual dekha?' },
  { start: '2:05', end: '3:10', speaker: 'Witness', text: 'Haan sahab, ek kali motorcycle thi, uspe do log the. Dono ne kala kapra pehna hua tha. Unhone ek bade bhai ki dukaan ke paas ruke, phir achanak kuch hua aur woh bhag gaye Kolar Road ki taraf.' },
  { start: '3:10', end: '3:22', speaker: 'Officer', text: 'Motorcycle ka number yaad hai?' },
  { start: '3:22', end: '3:58', speaker: 'Witness', text: 'Poora nahi, par MP 04 se shuru hota tha, itna pakka yaad hai. Kafi tez chala gaya.' },
  { start: '3:58', end: '4:12', speaker: 'Officer', text: 'Suspects ka chehra dekha?' },
  { start: '4:12', end: '4:32', speaker: 'Witness', text: 'Ek ka helmet tha, doosre ka aadha tha — jawaan lag raha tha, 25-30 saal. Medium height.' },
];

export const EXTRACTED_ENTITIES: ExtractedEntity[] = [
  { type: 'TIME', value: '20:30 hrs approx.', relevance: 'HIGH' },
  { type: 'LOCATION', value: 'Central Market, MP Nagar', relevance: 'HIGH' },
  { type: 'LOCATION', value: 'Kolar Road (escape direction)', relevance: 'HIGH' },
  { type: 'VEHICLE', value: 'Black Motorcycle — MP04xxxx', relevance: 'HIGH' },
  { type: 'PERSON', value: 'Suspect 1: Male, ~25–30 yrs, medium height, no helmet', relevance: 'HIGH' },
  { type: 'PERSON', value: 'Suspect 2: Male, helmeted', relevance: 'MEDIUM' },
  { type: 'OBJECT', value: 'Dark clothing (both suspects)', relevance: 'MEDIUM' },
];

export const KEY_POINTS = [
  'Two suspects on black motorcycle observed near Central Market at ~20:30',
  'Plate begins with MP04 — matches vehicle EV-1029 record',
  'Suspects fled towards Kolar Road after incident',
  'Suspect 1 approx. 25–30 years, medium height, no helmet',
  'Both suspects wore dark clothing',
  'Witness departing adjacent shop at time of incident',
];
