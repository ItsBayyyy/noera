import type {
  AttributeKey,
  DailyRoom,
  Destination,
  GlobalChallenge,
  PerspectivePoll,
  ReputationTier,
} from "./types";

import { SCENARIOS } from "./scenarios";
export { SCENARIOS };

export const ATTRIBUTES: { key: AttributeKey; label: string; hint: string }[] = [
  { key: "respect", label: "Respect", hint: "Reading hierarchy and distance" },
  { key: "empathy", label: "Empathy", hint: "Hearing what is not said" },
  { key: "adaptability", label: "Adaptability", hint: "Switching register mid-conversation" },
  { key: "context", label: "Context", hint: "Matching words to the moment" },
  { key: "confidence", label: "Confidence", hint: "Speaking without shrinking" },
  { key: "cultural", label: "Cultural Awareness", hint: "Noticing the unwritten rules" },
];

/* Progression is communication maturity, not levels. Each tier changes what
   kind of room you are ready to walk into. */
export const TIERS: ReputationTier[] = [
  {
    name: "Newcomer",
    min: 0,
    description: "You know words. The room is still a blur.",
    unlocks: "Clear, low-stakes situations with one social variable at a time.",
  },
  {
    name: "Observer",
    min: 30,
    description: "You notice tone before you answer.",
    unlocks: "Conversations that keep going after your first sentence.",
  },
  {
    name: "Adapter",
    min: 50,
    description: "You change register on purpose, not by accident.",
    unlocks: "Rooms where two people expect opposite things from you.",
  },
  {
    name: "Connector",
    min: 70,
    description: "People feel understood by you, and say so to others.",
    unlocks: "Repair scenarios — conversations that begin already damaged.",
  },
  {
    name: "Global Citizen",
    min: 86,
    description: "You are fluent in the moment, not only the language.",
    unlocks: "Ambiguous rooms with no good option, only better trade-offs.",
  },
];

/** Locale-independent thousands separator (server and client must agree). */
export function count(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function tierFor(score: number) {
  return [...TIERS].reverse().find((t) => score >= t.min) ?? TIERS[0];
}

export function strengthsAndGaps(attributes: Record<AttributeKey, number>) {
  const ranked = [...ATTRIBUTES]
    .map((a) => ({ key: a.key, value: attributes[a.key] }))
    .sort((a, b) => b.value - a.value);
  return {
    strengths: ranked.slice(0, 2).map((r) => r.key),
    gaps: ranked
      .slice(-2)
      .map((r) => r.key)
      .reverse(),
  };
}

/** Satu kalimat tentang komunikator seperti apa dirimu sedang tumbuh. */
export function profileNarrative(
  tierName: string,
  strengths: AttributeKey[],
  gaps: AttributeKey[],
  lang: "id" | "en" = "en",
) {
  const label = (k: AttributeKey) => {
    const en = ATTRIBUTES.find((a) => a.key === k)?.label ?? k;
    if (lang !== "id") return en.toLowerCase();
    const id: Record<string, string> = {
      Respect: "rasa hormatmu",
      Empathy: "empatimu",
      Adaptability: "keluwesanmu",
      Context: "kepekaan konteksmu",
      Confidence: "rasa percaya dirimu",
      "Cultural Awareness": "kepekaan budayamu",
    };
    return id[en] ?? en.toLowerCase();
  };

  const openersEn: Record<string, string> = {
    Newcomer: "You are still translating the room while it is talking.",
    Observer: "You read tone well — you just tend to wait for permission to use it.",
    Adapter: "You're confident in conversation, but still miss the quieter cultural cues.",
    Connector: "People leave conversations with you feeling heard, and they say so to others.",
    "Global Citizen": "You adjust before anyone notices there was something to adjust to.",
  };
  const openersId: Record<string, string> = {
    Newcomer: "Kamu masih menerjemahkan ruangannya sambil ruangan itu bicara.",
    Observer: "Kamu jago membaca nada — cuma sering menunggu izin sebelum memakainya.",
    Adapter: "Kamu percaya diri saat mengobrol, tapi masih melewatkan isyarat budaya yang lebih pelan.",
    Connector: "Orang keluar dari obrolan denganmu dengan perasaan didengar, dan mereka menceritakannya.",
    "Global Citizen": "Kamu menyesuaikan diri sebelum orang sadar ada yang perlu disesuaikan.",
  };

  if (lang === "id") {
    const opener = openersId[tierName] ?? openersId.Observer;
    return `${opener} ${label(strengths[0])} yang menopang sebagian besar ruangan; ${label(
      gaps[0],
    )} yang akan diuji di ruangan berikutnya.`;
  }
  const opener = openersEn[tierName] ?? openersEn.Observer;
  return `${opener} Your ${label(strengths[0])} carries most rooms; your ${label(
    gaps[0],
  )} is what the next ones will test.`;
}

/* -------------------------------------------------------------------------- */
/* The world — a content progression, not a tourism map                       */
/* -------------------------------------------------------------------------- */

export const DESTINATIONS: Destination[] = [
  {
    id: "tokyo",
    city: "Tokyo",
    flag: "JP",
    theme: "Hierarchy & indirectness",
    blurb: "Rooms where the request arrives already softened — and matching that softness is the answer.",
    scenarioTitle: "Meeting your professor",
    scenarioId: "tokyo-professor",
    scenarios: 12,
    x: 12,
    y: 70,
    accent: "#c2551f",
    unlocksAt: "Newcomer",
  },
  {
    id: "berlin",
    city: "Berlin",
    flag: "DE",
    theme: "Direct communication",
    blurb: "Rooms where clear disagreement, with a reason attached, is the respectful move.",
    scenarioTitle: "Giving critical feedback",
    scenarioId: "berlin-feedback",
    scenarios: 9,
    x: 30,
    y: 34,
    accent: "#3e7c5a",
    unlocksAt: "Newcomer",
  },
  {
    id: "newyork",
    city: "New York",
    flag: "US",
    theme: "Small talk & first contact",
    blurb: "Rooms where the first thirty seconds decide whether there is a second conversation.",
    scenarioTitle: "Meeting someone new",
    scenarioId: "newyork-smalltalk",
    scenarios: 11,
    x: 52,
    y: 22,
    accent: "#3d6b8c",
    unlocksAt: "Observer",
  },
  {
    id: "seoul",
    city: "Seoul",
    flag: "KR",
    theme: "Seniority & the group",
    blurb: "Rooms where age, order and gesture rearrange a sentence before you speak it.",
    scenarioTitle: "Declining an invitation",
    scenarioId: "seoul-dinner",
    scenarios: 8,
    x: 72,
    y: 42,
    accent: "#b24c3c",
    unlocksAt: "Observer",
  },
  {
    id: "jakarta",
    city: "Jakarta",
    flag: "ID",
    theme: "Politeness & familiarity",
    blurb: "Rooms where the relationship is renegotiated daily, and “maybe” can be a complete answer.",
    scenarioTitle: "Asking for help",
    scenarioId: "jakarta-invitation",
    scenarios: 10,
    x: 58,
    y: 68,
    accent: "#7a6a5c",
    unlocksAt: "Adapter",
  },
  {
    id: "paris",
    city: "Paris",
    flag: "FR",
    theme: "Social nuance & debate",
    blurb: "Rooms where pushing back is a form of attention, and the only forbidden move is going personal.",
    scenarioTitle: "Joining a conversation",
    scenarioId: "paris-disagree",
    scenarios: 7,
    x: 86,
    y: 72,
    accent: "#3a2115",
    unlocksAt: "Connector",
  },
];

/* -------------------------------------------------------------------------- */
/* Global Challenge — one situation, every learner                            */
/* -------------------------------------------------------------------------- */

export const GLOBAL_CHALLENGE: GlobalChallenge = {
  id: "praise-in-public",
  title: "This week's global challenge",
  situation: "Your manager praises your work — in front of the entire team.",
  stage: "Eleven people look up. You have about three seconds.",
  npc: {
    name: "Marisa",
    role: "Your manager · in front of everyone",
    character: {
      skin: "#e6bd93",
      hair: "#3b2b22",
      hairStyle: "bun",
      outfit: "#3e7c5a",
      collar: "#f4ede1",
    },
  },
  prompt: "…and honestly, the turnaround on this was down to one person. Take a bow!",
  options: [
    {
      key: "A",
      line: "“Thank you — that means a lot coming from you.”",
      register: "Accepts it directly",
      reaction: "happy",
      reading:
        "Protects the moment your manager is building, and your own standing inside it.",
    },
    {
      key: "B",
      line: "“Thanks — but honestly, the whole team carried this one.”",
      register: "Redirects to the group",
      reaction: "warm",
      reading:
        "Protects the people sitting beside you, at some cost to your own visibility.",
    },
    {
      key: "C",
      line: "“Ah — it was nothing, really.”",
      register: "Deflects the praise",
      reaction: "embarrassed",
      reading:
        "Protects you from standing out, and quietly discounts the thing being praised.",
    },
  ],
  global: { A: 31, B: 49, C: 20 },
  responders: 4812,
  regionCount: 26,
  regions: [
    {
      region: "Indonesia",
      flag: "ID",
      split: { A: 18, B: 64, C: 18 },
      note: "Learners here most often redirected the praise to the group.",
    },
    {
      region: "Japan",
      flag: "JP",
      split: { A: 12, B: 72, C: 16 },
      note: "Redirecting was the most common answer, with deflecting close behind.",
    },
    {
      region: "Germany",
      flag: "DE",
      split: { A: 61, B: 31, C: 8 },
      note: "Accepting the credit plainly was the most common answer here.",
    },
    {
      region: "United States",
      flag: "US",
      split: { A: 57, B: 36, C: 7 },
      note: "Many accepted first, then named a teammate straight afterwards.",
    },
    {
      region: "Brazil",
      flag: "BR",
      split: { A: 44, B: 45, C: 11 },
      note: "Responses were split almost evenly between accepting and redirecting.",
    },
  ],
  reflection:
    "None of these is the correct answer — each one protects something different: your visibility, your teammates, or your comfort. Learners inside every region chose all three, so these splits are tendencies among the people who answered, not rules about anyone. What they do show is that the same three seconds can read as confidence in one room and as self-promotion in another — and being understood means knowing which reading you are walking into.",
};

/* -------------------------------------------------------------------------- */
/* Daily Room — a new social situation each day. No streak, no XP.            */
/* -------------------------------------------------------------------------- */

export const DAILY_ROOM: DailyRoom = {
  id: "cancelled-again",
  label: "Today's room",
  situation: "Your friend cancels your plans. For the third time.",
  stage: "The message arrives forty minutes before you were supposed to meet.",
  npc: {
    name: "Théo",
    role: "Close friend · four years",
    character: {
      skin: "#c98d63",
      hair: "#241a16",
      hairStyle: "wave",
      outfit: "#3d6b8c",
      collar: "#f4ede1",
    },
  },
  prompt: "so sorry!! something came up again. rain check??",
  choices: [
    {
      id: "a",
      line: "All good — but that's three times now. Is everything actually okay with you?",
      register: "Names it · leaves room",
      accuracy: 95,
      culturalFit: 92,
      relationship: 6,
      reaction: "surprised",
      reply: "…yeah. no. not really. can I call you tonight?",
      verdict: "ideal",
      insight:
        "You made the pattern visible without turning it into an accusation — which is what let him answer honestly instead of apologising again.",
      attributes: { empathy: 3, confidence: 2, context: 2 },
    },
    {
      id: "b",
      line: "No worries at all! Whenever suits you.",
      register: "Frictionless · costs you",
      accuracy: 98,
      culturalFit: 61,
      relationship: -2,
      reaction: "neutral",
      reply: "you're the best!! next week for sure",
      verdict: "workable",
      insight:
        "Nothing broke, and nothing changed. Absorbing it silently a third time teaches you both that your time is the flexible one.",
      attributes: { confidence: -2, empathy: 1 },
    },
    {
      id: "c",
      line: "Unbelievable. Don't bother making plans with me again.",
      register: "Punishes · closes the door",
      accuracy: 96,
      culturalFit: 28,
      relationship: -14,
      reaction: "disappointed",
      reply: "…wow. ok.",
      verdict: "costly",
      insight:
        "The frustration was earned; the sentence spent all of it at once. An ultimatum ends the conversation you actually wanted to have.",
      attributes: { empathy: -3, adaptability: -2, confidence: 1 },
    },
  ],
};

/** Bocoran ruang besok — antisipasi bekerja lebih baik daripada beban streak. */
export const DAILY_NEXT = {
  teaserId: "Seseorang memujimu keras-keras di depan orang yang jelas tidak menyukaimu.",
  teaserEn: "Someone praises you loudly, in front of a person who clearly dislikes you.",
  tagId: "Ruang besok",
  tagEn: "Tomorrow's room",
};

/* -------------------------------------------------------------------------- */
/* Community — "Same situation, different world"                              */
/* -------------------------------------------------------------------------- */

export const POLLS: PerspectivePoll[] = [
  {
    id: "stay-after-class",
    scenario: "Your professor asks you to stay after class.",
    setting: "You have no idea why. What is your first sentence?",
    options: [
      { key: "A", line: "“Of course — is everything alright?”", dimension: "Hangat · peduli dulu" },
      { key: "B", line: "“Yes, sensei.” (wait to be told)", dimension: "Hierarki · menunggu diberi tahu" },
      { key: "C", line: "“Sure — what's this about?”", dimension: "Langsung · minta konteks" },
    ],
    regions: [
      {
        region: "Indonesia",
        flag: "ID",
        split: { A: 64, B: 24, C: 12 },
        speaker: "Nadia, Bandung",
        voice: "Asking “is everything alright” shows care first. Going straight to the reason can feel like you're demanding something from a teacher.",
      },
      {
        region: "Japan",
        flag: "JP",
        split: { A: 11, B: 81, C: 8 },
        speaker: "Kenta, Osaka",
        voice: "I'd wait. He'll explain when he decides to — asking why puts pressure on him to justify himself first.",
      },
      {
        region: "United States",
        flag: "US",
        split: { A: 16, B: 12, C: 72 },
        speaker: "Marcus, Chicago",
        voice: "Asking what it's about doesn't feel rude to me, it feels efficient. Most of my professors seemed to appreciate it.",
      },
      {
        region: "Germany",
        flag: "DE",
        split: { A: 14, B: 9, C: 77 },
        speaker: "Lena, Hamburg",
        voice: "Direct question, direct answer. Softening it would just make the conversation longer than it needs to be.",
      },
    ],
    explanation:
      "Every group here believes it is being polite — the disagreement is about who is allowed to hold information. Where meaning is revealed slowly, asking early can feel like pressure; where things are stated plainly, withholding the reason is what feels impolite. Learners in each region chose all three answers.",
  },
  {
    id: "declining-food",
    scenario: "Your host offers you a third serving. You are full.",
    setting: "How do you decline?",
    options: [
      { key: "A", line: "“No thank you, I'm full.”", dimension: "Langsung · jujur" },
      { key: "B", line: "“It's delicious — maybe a little later.”", dimension: "Hangat · menunda halus" },
      { key: "C", line: "Accept it, eat slowly, leave some.", dimension: "Konteks · menjaga muka tuan rumah" },
    ],
    regions: [
      {
        region: "Germany",
        flag: "DE",
        split: { A: 79, B: 15, C: 6 },
        speaker: "Jonas, Leipzig",
        voice: "Saying no clearly feels respectful to me. Pretending I might eat later just leaves the host guessing.",
      },
      {
        region: "Indonesia",
        flag: "ID",
        split: { A: 12, B: 61, C: 27 },
        speaker: "Rafi, Surabaya",
        voice: "I try not to close the door completely. “Maybe later” lets the host keep offering without either of us losing face.",
      },
      {
        region: "South Korea",
        flag: "KR",
        split: { A: 18, B: 30, C: 52 },
        speaker: "Ji-woo, Seoul",
        voice: "Leaving a little on the plate says “you gave me more than enough”. Emptying it can suggest I could have eaten more.",
      },
      {
        region: "United States",
        flag: "US",
        split: { A: 68, B: 24, C: 8 },
        speaker: "Ashley, Denver",
        voice: "A clear no with a compliment attached. The hosts I know would rather I be comfortable than polite.",
      },
    ],
    explanation:
      "No group here is choosing to be rude — they are protecting different things. Some protect the truth of your appetite, others protect the host's generosity. Fluency is knowing which of the two is at stake in the room you are standing in.",
  },
];

export const COMMUNITY_THREADS = [
  {
    id: "t1",
    title: "My “thank you” sounded sarcastic and I still don't know why",
    author: "Dimas",
    flag: "ID",
    scenario: "Tokyo · Receiving help",
    replies: 34,
    insight: 12,
    excerpt:
      "I used the most polite form I knew with a classmate my own age. He laughed and said it felt like I was joking. Turns out extra formality between peers can read as distance — or mockery.",
  },
  {
    id: "t2",
    title: "In Berlin my feedback was “too nice to be useful”",
    author: "Sofia",
    flag: "BR",
    scenario: "Berlin · Studio critique",
    replies: 51,
    insight: 28,
    excerpt:
      "I spent two sentences complimenting before the real point. My lead thought I had no opinion. I've started leading with the verdict and putting the warmth after.",
  },
  {
    id: "t3",
    title: "Small talk isn't fake — it's a door. Took me a year.",
    author: "Yuki",
    flag: "JP",
    scenario: "New York · Elevator",
    replies: 78,
    insight: 41,
    excerpt:
      "I used to answer weather questions with facts. Nobody was asking about weather. Once I started volleying back, people started introducing themselves.",
  },
];

export const LIVE_REGIONS = [
  { flag: "ID", name: "Indonesia", note: "softening a refusal", learners: 812 },
  { flag: "JP", name: "Japan", note: "reading silence", learners: 640 },
  { flag: "DE", name: "Germany", note: "disagreeing early", learners: 501 },
  { flag: "KR", name: "South Korea", note: "seniority at dinner", learners: 447 },
  { flag: "US", name: "United States", note: "the first thirty seconds", learners: 738 },
  { flag: "FR", name: "France", note: "arguing as attention", learners: 389 },
];

/* --------------------------------------------------------------------------
   PEMBACAAN SOSIAL & RUTE ADAPTIF

   Enam angka atribut tidak lagi ditampilkan sebagai meteran. Dua fungsi di
   bawah ini yang memakainya: satu mengubahnya jadi kalimat tentang perilaku,
   satu lagi memilih ruangan berikutnya.

   Ini aturan tetap (rule-based), bukan pembelajaran mesin — dan memang tidak
   diklaim begitu di antarmuka. Yang penting: apa yang pernah diucapkan
   pengguna menentukan apa yang ditawarkan berikutnya.
   -------------------------------------------------------------------------- */

/** Bacaan perilaku per atribut, dipisah rendah/tinggi. Bukan skor — kalimat. */
const READINGS: Record<
  AttributeKey,
  { low: { id: string; en: string }; high: { id: string; en: string } }
> = {
  respect: {
    low: {
      id: "Kamu cenderung terdengar sangat langsung ketika bicara dengan orang yang punya otoritas.",
      en: "You tend to sound very direct when you speak to someone with authority over you.",
    },
    high: {
      id: "Kamu membaca jarak dan posisi dengan baik sebelum memilih kata.",
      en: "You read distance and standing well before you pick your words.",
    },
  },
  empathy: {
    low: {
      id: "Kamu menjawab apa yang dikatakan, dan sering melewatkan apa yang sebenarnya diminta.",
      en: "You answer what was said, and often miss what was actually being asked.",
    },
    high: {
      id: "Kamu menangkap yang tidak diucapkan, dan menjawab bagian itu juga.",
      en: "You catch what goes unsaid, and answer that part too.",
    },
  },
  adaptability: {
    low: {
      id: "Nada bicaramu hampir sama di semua ruangan, siapa pun lawan bicaranya.",
      en: "Your register stays about the same in every room, whoever is across from you.",
    },
    high: {
      id: "Kamu berganti nada di tengah percakapan dengan sengaja, bukan kebetulan.",
      en: "You change register mid-conversation on purpose, not by accident.",
    },
  },
  context: {
    low: {
      id: "Kalimatmu benar, tapi belum selalu cocok dengan momen saat ia diucapkan.",
      en: "Your sentences are correct, but not always matched to the moment they land in.",
    },
    high: {
      id: "Kamu menimbang situasinya dulu, baru memilih kalimat.",
      en: "You weigh the situation first, then choose the sentence.",
    },
  },
  confidence: {
    low: {
      id: "Kamu sering memperkecil maksudmu sendiri supaya terdengar aman.",
      en: "You often shrink your own meaning to keep it safe.",
    },
    high: {
      id: "Kamu menyampaikan maksudmu tanpa meminta maaf lebih dulu.",
      en: "You say what you mean without apologising for it first.",
    },
  },
  cultural: {
    low: {
      id: "Aturan yang tidak tertulis di sebuah ruangan masih sering lewat begitu saja.",
      en: "A room's unwritten rules still tend to pass you by.",
    },
    high: {
      id: "Kamu menangkap aturan yang tidak pernah dijelaskan siapa pun.",
      en: "You notice the rules nobody ever explains out loud.",
    },
  },
};

/**
 * Tiga sampai empat kalimat tentang bagaimana orang membaca kamu — dua dari
 * yang paling menonjol, dua dari yang paling tertinggal.
 */
export function socialReadings(
  attributes: Record<AttributeKey, number>,
  lang: "id" | "en" = "id",
) {
  const ranked = ATTRIBUTES.map((a) => ({ key: a.key, value: attributes[a.key] })).sort(
    (a, b) => b.value - a.value,
  );
  const pick = (k: AttributeKey, side: "low" | "high") =>
    READINGS[k][side][lang === "id" ? "id" : "en"];
  return [
    { key: ranked[0].key, tone: "high" as const, text: pick(ranked[0].key, "high") },
    { key: ranked[1].key, tone: "high" as const, text: pick(ranked[1].key, "high") },
    { key: ranked[ranked.length - 2].key, tone: "low" as const, text: pick(ranked[ranked.length - 2].key, "low") },
    { key: ranked[ranked.length - 1].key, tone: "low" as const, text: pick(ranked[ranked.length - 1].key, "low") },
  ];
}

/** Atribut terlemah -> ruangan yang paling melatih atribut itu. */
const TRAINS: Record<AttributeKey, string> = {
  respect: "seoul-dinner",
  empathy: "jakarta-invitation",
  adaptability: "newyork-smalltalk",
  context: "berlin-feedback",
  confidence: "paris-disagree",
  cultural: "tokyo-professor",
};

/**
 * Ruangan yang disarankan berikutnya, dipilih dari atribut paling tertinggal.
 *
 * Aturannya: ambil atribut terlemah, cari ruangan yang melatihnya. Kalau
 * ruangan itu masih terkunci oleh tingkat, atau sudah pernah dijalani,
 * lanjut ke atribut terlemah berikutnya. Kalau semuanya sudah dijalani,
 * ruangan terlemah tetap disarankan untuk diulang.
 */
export function recommendedRoom(
  attributes: Record<AttributeKey, number>,
  completed: Record<string, string>,
  tierName: string,
) {
  const scenarios = SCENARIOS;
  const tierRank = (n: string) => TIERS.findIndex((t) => t.name === n);
  const reached = tierRank(tierName);
  const ranked = ATTRIBUTES.map((a) => ({ key: a.key, value: attributes[a.key] })).sort(
    (a, b) => a.value - b.value,
  );

  const usable = (id: string) => {
    const sc = scenarios.find((s) => s.id === id);
    if (!sc) return false;
    return !sc.requires || tierRank(sc.requires) <= reached;
  };

  // 1. terlemah yang ruangannya terbuka DAN belum pernah dijalani
  for (const r of ranked) {
    const id = TRAINS[r.key];
    if (usable(id) && !completed[id]) {
      return { scenario: scenarios.find((s) => s.id === id)!, attribute: r.key, replay: false };
    }
  }
  // 2. semua sudah dijalani -> ulangi yang melatih kelemahan terbesar
  for (const r of ranked) {
    const id = TRAINS[r.key];
    if (usable(id)) {
      return { scenario: scenarios.find((s) => s.id === id)!, attribute: r.key, replay: true };
    }
  }
  return { scenario: scenarios[0], attribute: ranked[0].key, replay: false };
}

/* --------------------------------------------------------------------------
   KURIKULUM ENAM SUMBU

   Enam ruangan di Noera bukan enam skenario acak: tiap ruangan menguji SATU
   sumbu komunikasi sosial, dan keenam sumbunya sama persis dengan enam atribut
   yang membentuk Potret Sosial.

   Pemetaannya sudah lama ada di `TRAINS` (sumbu -> ruangan) dan dipakai untuk
   memilih ruangan berikutnya. Yang belum ada: arah sebaliknya, supaya
   antarmuka bisa menyebutkan ruangan ini menguji apa — dan sumbu mana yang
   belum pernah menguji pengguna sama sekali.

   Tidak ada konten baru di sini. Ini cuma membuat kurikulum yang sudah ada
   jadi terbaca.
   -------------------------------------------------------------------------- */

/** Ruangan -> sumbu yang diujinya. Kebalikan dari TRAINS. */
export const AXIS_OF_ROOM: Record<string, AttributeKey> = Object.fromEntries(
  Object.entries(TRAINS).map(([axis, roomId]) => [roomId, axis as AttributeKey]),
) as Record<string, AttributeKey>;

export function axisForRoom(scenarioId: string): AttributeKey | null {
  return AXIS_OF_ROOM[scenarioId] ?? null;
}

/** Keenam sumbu, berikut ruangan yang mengujinya dan sudah/belum dijalani. */
export function curriculum(completed: Record<string, string>) {
  return ATTRIBUTES.map((a) => {
    const roomId = TRAINS[a.key];
    const room = SCENARIOS.find((s) => s.id === roomId);
    return {
      axis: a.key,
      label: a.label,
      hint: a.hint,
      room,
      tested: Boolean(completed[roomId]),
    };
  });
}

/**
 * Sumbu yang belum pernah menguji pengguna sama sekali.
 *
 * Dipakai untuk menutup sesi dengan pertanyaan terbuka. Kalau keenamnya sudah
 * dijalani, mengembalikan null — dan pemanggilnya TIDAK boleh mengarang sumbu
 * berikutnya.
 */
export function firstUntestedAxis(completed: Record<string, string>) {
  return curriculum(completed).find((c) => !c.tested) ?? null;
}
