/** Core domain model for Noera. Everything is client-side mock data. */

export type Expression =
  | "idle"
  | "warm"
  | "happy"
  | "neutral"
  | "confused"
  | "awkward"
  | "surprised"
  | "embarrassed"
  | "disappointed"
  | "angry";

export type AttributeKey =
  | "respect"
  | "empathy"
  | "adaptability"
  | "context"
  | "confidence"
  | "cultural";

export type Verdict = "ideal" | "workable" | "costly";

export interface CharacterSpec {
  /** Palette + features for the hand-drawn sprite. */
  skin: string;
  hair: string;
  hairStyle: "bob" | "crop" | "bun" | "curls" | "long" | "wave";
  outfit: string;
  collar: string;
  glasses?: boolean;
}

export interface Choice {
  id: string;
  /** The sentence the learner would say. */
  line: string;
  /** Register label shown as a quiet annotation on the option. */
  register: string;
  accuracy: number;
  culturalFit: number;
  relationship: number;
  reaction: Expression;
  /** What the NPC says back — the story continues differently. */
  reply: string;
  verdict: Verdict;
  /** One sentence of *why*. Never "correct/incorrect". */
  insight: string;
  attributes: Partial<Record<AttributeKey, number>>;
}

/**
 * One exchange in a conversation. The NPC's opening line can differ depending
 * on how the previous exchange went — the room remembers.
 */
export interface Beat {
  id: string;
  prompt: string | Record<Verdict, string>;
  /** Quiet stage direction shown above the line, hand-written. */
  stage?: string;
  choices: Choice[];
}

/** The language skills a room actually trains, named for the learner. */
export type Skill = "reading" | "listening" | "speaking" | "culture";

/**
 * The message that got you into the room. Read it, then answer one question
 * about what is *actually* being asked — comprehension of subtext, not
 * vocabulary. This is the reading half of the scenario.
 */
export interface Brief {
  from: string;
  channel: string;
  body: string;
  question: string;
  options: { id: string; text: string; correct?: boolean; note: string }[];
}

export interface Scenario {
  id: string;
  index: number;
  city: string;
  region: string;
  flag: string;
  title: string;
  /** Short social frame: who you are, who they are. */
  setting: string;
  /** The social variable being trained. */
  tension: string;
  /** Tier at which the scenario becomes available. */
  requires?: string;
  skills: Skill[];
  brief: Brief;
  npc: {
    name: string;
    role: string;
    /** Starting warmth toward the learner, 0–100. */
    relationship: number;
    character: CharacterSpec;
  };
  beats: Beat[];
  /** Closing narration, chosen by how the whole conversation landed. */
  ending: Record<Verdict, string>;
  /** Post-scene cultural explanation. */
  note: string;
}

export interface Destination {
  id: string;
  city: string;
  flag: string;
  /** The social skill this place trains — never tourism. */
  theme: string;
  blurb: string;
  /** The scenario that teaches it, by name. */
  scenarioTitle: string;
  scenarioId: string;
  scenarios: number;
  /** Percentage position on the illustrated route. */
  x: number;
  y: number;
  accent: string;
  /** Reputation tier that opens this stop. */
  unlocksAt: string;
  locked?: boolean;
}

export interface PerspectiveOption {
  key: string;
  line: string;
  /** Kosakata yang sama dengan `register` pada pilihan skenario — supaya
      jawaban komunitas terbaca memakai bahasa yang sudah dipelajari:
      kelangsungan, kehangatan, hierarki, konteks. */
  dimension?: string;
}

export interface RegionSplit {
  region: string;
  flag: string;
  /** Share per option key, summing to 100. */
  split: Record<string, number>;
  voice: string;
  speaker: string;
}

export interface PerspectivePoll {
  id: string;
  scenario: string;
  setting: string;
  options: PerspectiveOption[];
  regions: RegionSplit[];
  explanation: string;
}

export interface ChallengeOption {
  key: string;
  line: string;
  register: string;
  reaction: Expression;
  /** What this answer protects, socially. */
  reading: string;
}

export interface GlobalChallenge {
  id: string;
  title: string;
  situation: string;
  stage: string;
  npc: { name: string; role: string; character: CharacterSpec };
  prompt: string;
  options: ChallengeOption[];
  global: Record<string, number>;
  regions: { region: string; flag: string; split: Record<string, number>; note: string }[];
  responders: number;
  regionCount: number;
  reflection: string;
}

export interface DailyRoom {
  id: string;
  label: string;
  situation: string;
  stage: string;
  npc: { name: string; role: string; character: CharacterSpec };
  prompt: string;
  choices: Choice[];
}

export interface ReputationTier {
  name: string;
  min: number;
  description: string;
  unlocks: string;
}
