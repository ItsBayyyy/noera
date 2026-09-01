import type { Scenario } from "./types";

/* --------------------------------------------------------------------------
   Scenarios are conversations, not questions.

   Each one runs over two or three exchanges. The NPC's next line is written
   three ways — the room remembers how the previous sentence landed — and the
   relationship you carry into the last beat is the one you built in the first.
   -------------------------------------------------------------------------- */

export const SCENARIOS: Scenario[] = [
  {
    id: "tokyo-professor",
    index: 1,
    city: "Tokyo",
    region: "Japan",
    flag: "JP",
    title: "Meeting your professor",
    setting: "First week of your exchange programme. You have never spoken to him before.",
    tension: "Hierarchy & indirectness",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "Faculty office, on behalf of Prof. Sato",
      channel: "Email · this morning",
      body: "Dear student, Prof. Sato has asked me to arrange a short meeting this afternoon regarding your progress report. He has fifteen minutes at four o'clock. He mentioned it would be good to meet you properly at last.",
      question: "What is this meeting actually about?",
      options: [
        {
          id: "a",
          text: "A formal review of my report.",
          note: "The report is the reason given, not the reason. Fifteen minutes and “at last” are doing quieter work here than the word “report”.",
        },
        {
          id: "b",
          text: "A first introduction, with the report as the excuse.",
          correct: true,
          note: "“Meet you properly at last” is the real sentence in this email. The report only gives the meeting a shape it can be booked under.",
        },
        {
          id: "c",
          text: "A warning about my performance.",
          note: "Nothing here carries a warning. Reading threat into neutral formality is one of the most common misreadings learners make in a second language.",
        },
      ],
    },
    npc: {
      name: "Prof. Sato",
      role: "Faculty supervisor · met 2 minutes ago",
      relationship: 72,
      character: {
        skin: "#e8c39a",
        hair: "#2c2320",
        hairStyle: "crop",
        outfit: "#3d6b8c",
        collar: "#f4ede1",
        glasses: true,
      },
    },
    note: "In Japanese academic settings the request already arrives softened — “could you” is doing polite work. Matching that softness signals you read the hierarchy. Over-formality is not the safe option: it puts a wall where he offered a bridge.",
    ending: {
      ideal:
        "He walks you to the door — a small thing he does not do for everyone. You will get the difficult questions from now on, which is how this professor says he trusts you.",
      workable:
        "The meeting ends on time and nothing is broken. You are a student he supervises. Not yet one he thinks about between meetings.",
      costly:
        "He is polite to the last syllable. Next week the office emails you instead of him, and you will never be told that anything happened.",
    },
    beats: [
      {
        id: "t1",
        stage: "He looks up from the paper on his desk.",
        prompt: "Could you send me the report?",
        choices: [
          {
            id: "a",
            line: "Sure, I'll send it tonight — would tomorrow morning also be fine?",
            register: "Warm · deferential · specific",
            accuracy: 96,
            culturalFit: 94,
            relationship: 5,
            reaction: "happy",
            reply: "Tomorrow morning is perfectly fine. Thank you for telling me.",
            verdict: "ideal",
            insight:
              "You accepted, committed to a time, and quietly gave him room to adjust it. Respect here is about protecting the other person's options.",
            attributes: { respect: 3, context: 3, empathy: 2, cultural: 2 },
          },
          {
            id: "b",
            line: "I would be deeply honoured to fulfil your request at once.",
            register: "Over-formal · ceremonial",
            accuracy: 98,
            culturalFit: 41,
            relationship: -6,
            reaction: "awkward",
            reply: "Ah… yes. Well. There is no rush, really.",
            verdict: "costly",
            insight:
              "Grammatically flawless, socially loud. Ceremonial language between a supervisor and a student reads as distance — or as sarcasm.",
            attributes: { context: -2, cultural: -2, adaptability: -1 },
          },
          {
            id: "c",
            line: "Yeah, no problem. Sending it whenever.",
            register: "Casual · vague",
            accuracy: 91,
            culturalFit: 28,
            relationship: -12,
            reaction: "disappointed",
            reply: "I see. …I will ask the office to follow up.",
            verdict: "costly",
            insight:
              "“Whenever” removes the commitment. In a setting built on reliability, vagueness costs more than an accent ever will.",
            attributes: { respect: -3, context: -2, confidence: 1 },
          },
        ],
      },
      {
        id: "t2",
        stage: "He closes the folder. This part is not administrative.",
        prompt: {
          ideal: "Good. While you're here — how are you finding the seminar? Honestly.",
          workable: "…One more thing. How are you finding the seminar? Honestly.",
          costly: "…Before you go. The seminar. How is it. Honestly.",
        },
        choices: [
          {
            id: "a",
            line: "Honestly, I'm behind on the readings — so I've started meeting Aiko on Thursdays to catch up.",
            register: "Honest · already acting",
            accuracy: 95,
            culturalFit: 92,
            relationship: 4,
            reaction: "happy",
            reply: "That is the right instinct. Bring the questions to me next time, not only to her.",
            verdict: "ideal",
            insight:
              "You named a weakness and showed it was already being handled. Honesty with a plan is trust; honesty without one is a burden you hand over.",
            attributes: { confidence: 2, context: 2, empathy: 1, cultural: 1 },
          },
          {
            id: "b",
            line: "It's fine. No problems at all.",
            register: "Closed · reassuring",
            accuracy: 99,
            culturalFit: 43,
            relationship: -5,
            reaction: "neutral",
            reply: "…I see. Then I will assume you need nothing from me.",
            verdict: "costly",
            insight:
              "“Fine” closed a door he opened deliberately. When someone senior asks for honesty, the polite answer is the informative one.",
            attributes: { context: -2, confidence: -1, cultural: -1 },
          },
          {
            id: "c",
            line: "The pace is too fast and the reading list is unreasonable.",
            register: "Direct · blames the design",
            accuracy: 96,
            culturalFit: 57,
            relationship: -2,
            reaction: "confused",
            reply: "Unreasonable. …Hm. Tell me which paper lost you.",
            verdict: "workable",
            insight:
              "The content was fair; the framing made it his fault. Criticism travels further when it is aimed at the problem than at the person who set it.",
            attributes: { confidence: 2, empathy: -2, adaptability: -1 },
          },
        ],
      },
      {
        id: "t3",
        stage: "He stands. The meeting is over — but he is still talking.",
        prompt: {
          ideal:
            "Then we're done. …You know, most students never tell me anything is difficult.",
          workable: "Alright. We'll leave it there. Anything before you go?",
          costly: "That's all, then.",
        },
        choices: [
          {
            id: "a",
            line: "Thank you for asking twice. Most people only ask once.",
            register: "Names what he did",
            accuracy: 96,
            culturalFit: 91,
            relationship: 3,
            reaction: "warm",
            reply: "…Hm. Thursday, then. Bring the difficult questions.",
            verdict: "ideal",
            insight:
              "You acknowledged an effort he made instead of the favour he granted. Noticing is the cheapest and rarest form of respect.",
            attributes: { empathy: 3, respect: 2, cultural: 1 },
          },
          {
            id: "b",
            line: "I'll send the report and my questions together tonight.",
            register: "Competent · transactional",
            accuracy: 97,
            culturalFit: 84,
            relationship: 1,
            reaction: "neutral",
            reply: "Good. I'll read them before Thursday.",
            verdict: "workable",
            insight:
              "Ending on a commitment is safe and professional. Nothing was lost — and nothing beyond the task was built either.",
            attributes: { context: 1, confidence: 1 },
          },
          {
            id: "c",
            line: "Okay. Bye.",
            register: "Minimal · unmarked exit",
            accuracy: 100,
            culturalFit: 22,
            relationship: -7,
            reaction: "disappointed",
            reply: "…Goodbye.",
            verdict: "costly",
            insight:
              "A closing line is still a line. Leaving without marking the end reads as leaving without valuing it.",
            attributes: { respect: -3, cultural: -2 },
          },
        ],
      },
    ],
  },

  {
    id: "berlin-feedback",
    index: 2,
    city: "Berlin",
    region: "Germany",
    flag: "DE",
    title: "Giving critical feedback",
    setting: "Your design lead hands you a draft and waits. She is direct by default.",
    tension: "Directness without coldness",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "Anja",
      channel: "Team chat · four minutes ago",
      body: "pushing v2 of the landing page to you now. i've been staring at it too long to see it. tell me straight which one works — i don't need it wrapped in cotton wool. have to decide before standup tomorrow.",
      question: "What is “I don't need it wrapped in cotton wool” asking you to do?",
      options: [
        {
          id: "a",
          text: "Reassure her that both versions are fine.",
          note: "Reassurance is the exact thing she is refusing in advance. She is asking for its opposite.",
        },
        {
          id: "b",
          text: "Skip the softening and give a verdict she can act on.",
          correct: true,
          note: "She named a deadline and pre-authorised bluntness. The politeness she wants is a clear answer, delivered fast.",
        },
        {
          id: "c",
          text: "Be careful — she sounds irritated with me.",
          note: "Directness misread as irritation is a common cross-cultural false alarm. Nothing here is aimed at you; it is aimed at tomorrow's standup.",
        },
      ],
    },
    npc: {
      name: "Anja",
      role: "Design lead · works with you daily",
      relationship: 68,
      character: {
        skin: "#f0d3ba",
        hair: "#a8562f",
        hairStyle: "bob",
        outfit: "#3e7c5a",
        collar: "#f4ede1",
      },
    },
    note: "Professional directness here is not rudeness; over-cushioning a critique can read as evasive, or as withholding information. Disagreement offered with a reason is treated as a form of respect.",
    ending: {
      ideal:
        "She rewrites the headline with your line in it. Two weeks later she sends you her drafts before anyone else sees them.",
      workable:
        "The work ships. She keeps asking your opinion, and keeps having to ask twice.",
      costly:
        "She stops bringing drafts to you. Nothing was said. You are simply no longer part of how the work gets decided.",
    },
    beats: [
      {
        id: "b1",
        stage: "She slides the printout across and doesn't fill the silence.",
        prompt: "So — be honest. Does the second version work or not?",
        choices: [
          {
            id: "a",
            line: "The second one is weaker — the headline buries the point. The first, with your new spacing, wins.",
            register: "Direct · specific · constructive",
            accuracy: 97,
            culturalFit: 93,
            relationship: 6,
            reaction: "happy",
            reply: "Good. That's what I thought too, but I wanted to hear it from you.",
            verdict: "ideal",
            insight:
              "You answered the actual question, gave a reason, and pointed at a path forward. Directness plus specificity reads as competence.",
            attributes: { confidence: 3, context: 2, adaptability: 2, cultural: 2 },
          },
          {
            id: "b",
            line: "Oh, they're both really great! Maybe just tiny things here and there, no big deal.",
            register: "Cushioned · non-committal",
            accuracy: 95,
            culturalFit: 34,
            relationship: -9,
            reaction: "confused",
            reply: "…That doesn't help me. I asked because I need a decision.",
            verdict: "costly",
            insight:
              "Politeness strategies do not travel unchanged. What is kindness in one room is withheld information in another.",
            attributes: { confidence: -2, cultural: -2, context: -1 },
          },
          {
            id: "c",
            line: "It's bad. Redo it.",
            register: "Blunt · no reasoning",
            accuracy: 88,
            culturalFit: 52,
            relationship: -4,
            reaction: "angry",
            reply: "Bad how? I can't work with that.",
            verdict: "workable",
            insight:
              "Direct rooms still expect an argument, not a verdict. Directness without reasoning is just force.",
            attributes: { empathy: -2, confidence: 1, context: -1 },
          },
        ],
      },
      {
        id: "b2",
        stage: "She uncaps a pen and holds it out to you.",
        prompt: {
          ideal: "Okay. Then help me fix it — what would you write instead?",
          workable: "Fine. But I still need a headline. What would you write?",
          costly: "Let's try this again. What would you actually write?",
        },
        choices: [
          {
            id: "a",
            line: "“Ship less, learn faster.” It says the thing the first version was dancing around.",
            register: "Concrete alternative",
            accuracy: 96,
            culturalFit: 94,
            relationship: 5,
            reaction: "happy",
            reply: "That's better than mine. Annoying. We're using it.",
            verdict: "ideal",
            insight:
              "You brought material instead of judgement. In direct working cultures the person with the specific proposal ends up owning the room.",
            attributes: { confidence: 3, adaptability: 2, context: 2 },
          },
          {
            id: "b",
            line: "I don't know — you're the design lead, it's your call.",
            register: "Defers to rank",
            accuracy: 98,
            culturalFit: 36,
            relationship: -7,
            reaction: "disappointed",
            reply: "I asked because I wanted your brain, not your deference.",
            verdict: "costly",
            insight:
              "Deferring to seniority read as declining to contribute. The hierarchy in this room is flatter than you assumed.",
            attributes: { confidence: -3, context: -2 },
          },
          {
            id: "c",
            line: "Honestly, anything is better than what's there now.",
            register: "Opinion without proposal",
            accuracy: 94,
            culturalFit: 46,
            relationship: -3,
            reaction: "neutral",
            reply: "That's not a headline. That's a mood.",
            verdict: "workable",
            insight:
              "Confidence with nothing attached is noise. She needed a sentence she could put on the page.",
            attributes: { confidence: 1, context: -2 },
          },
        ],
      },
    ],
  },

  {
    id: "newyork-smalltalk",
    index: 3,
    city: "New York",
    region: "USA",
    flag: "US",
    title: "Meeting someone new",
    setting: "Floor 2 to floor 21. A senior colleague you have never met steps in beside you.",
    tension: "Small talk & warm distance",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "A teammate, during your first week",
      channel: "Direct message · yesterday",
      body: "heads up, you'll run into Denise in the elevator sooner or later — she's VP of partnerships. she talks to everyone. and she remembers the ones who talk back. that's genuinely how half this floor got their projects funded.",
      question: "What is your teammate really warning you about?",
      options: [
        {
          id: "a",
          text: "That she is senior, so I should be formal with her.",
          note: "Formality is the reflex, and the wrong one here. The message says she talks to everyone — rank is not the obstacle in this lift.",
        },
        {
          id: "b",
          text: "That a throwaway conversation is doing real work.",
          correct: true,
          note: "“Remembers the ones who talk back” is the whole message. Small talk here is not filler before the business — it is where the business starts.",
        },
        {
          id: "c",
          text: "That I should pitch my project if I meet her.",
          note: "Too fast. Pitching inside a two-minute lift ride reads as using the person, which is the one move that ends the relationship early.",
        },
      ],
    },
    npc: {
      name: "Denise",
      role: "VP of Partnerships · stranger",
      relationship: 50,
      character: {
        skin: "#8d5a3b",
        hair: "#241a16",
        hairStyle: "curls",
        outfit: "#c2551f",
        collar: "#f4ede1",
      },
    },
    note: "Small talk here is a handshake made of words: the content is disposable, the willingness to play is the signal. Declining the volley can read as coldness rather than efficiency.",
    ending: {
      ideal:
        "She remembers your name at the offsite, in front of people whose opinion of you matters. Nineteen floors did that.",
      workable:
        "A pleasant elevator ride. You will introduce yourselves again in four months as if this never happened.",
      costly:
        "She goes back to her phone. The door opens, and you are exactly as known as you were on floor two.",
    },
    beats: [
      {
        id: "n1",
        stage: "The doors close. She smiles at the ceiling, then at you.",
        prompt: "Morning! Crazy weather out there, huh?",
        choices: [
          {
            id: "a",
            line: "Right? I left home in sunshine and arrived in a monsoon. You made it in dry, at least!",
            register: "Playful · returns the serve",
            accuracy: 94,
            culturalFit: 96,
            relationship: 7,
            reaction: "happy",
            reply: "Ha! Barely. I'm Denise, by the way.",
            verdict: "ideal",
            insight:
              "You matched her energy and handed the conversation back. That volley is what opened the door to an actual introduction.",
            attributes: { adaptability: 3, confidence: 2, empathy: 2, cultural: 2 },
          },
          {
            id: "b",
            line: "Yes. Precipitation is about 40% above the seasonal average this month.",
            register: "Literal · informational",
            accuracy: 99,
            culturalFit: 30,
            relationship: -5,
            reaction: "surprised",
            reply: "…Huh. Okay. Good to know.",
            verdict: "costly",
            insight:
              "You answered the words instead of the invitation. The weather was never the topic — availability was.",
            attributes: { context: -3, empathy: -1 },
          },
          {
            id: "c",
            line: "Mm.",
            register: "Minimal · closed",
            accuracy: 100,
            culturalFit: 12,
            relationship: -10,
            reaction: "neutral",
            reply: "(She turns back to her phone.)",
            verdict: "costly",
            insight:
              "A perfectly correct utterance that ended a relationship before it started. Silence is a message too.",
            attributes: { confidence: -2, adaptability: -2, empathy: -1 },
          },
        ],
      },
      {
        id: "n2",
        stage: "Floor nine. She turns to face you properly.",
        prompt: {
          ideal: "So which team are you on? I feel like I should know you already.",
          workable: "…So. Which team are you on?",
          costly: "…Which floor are you, again?",
        },
        choices: [
          {
            id: "a",
            line: "Partnerships analytics — I'm the one who sends the Monday numbers nobody reads.",
            register: "Warm · gives a hook",
            accuracy: 95,
            culturalFit: 95,
            relationship: 6,
            reaction: "happy",
            reply: "Ha — I read them! Mostly. Come find me at the offsite, I have questions.",
            verdict: "ideal",
            insight:
              "A fact plus a little self-deprecation gave her something to remember you by. Small talk is a memory device.",
            attributes: { confidence: 2, adaptability: 3, empathy: 1 },
          },
          {
            id: "b",
            line: "I work in partnerships analytics, under the VP of data operations.",
            register: "Org chart · formal",
            accuracy: 99,
            culturalFit: 44,
            relationship: -4,
            reaction: "neutral",
            reply: "Right. …Well. Good to meet you.",
            verdict: "workable",
            insight:
              "A job title is not an introduction. You answered the structure instead of the person standing in front of you.",
            attributes: { context: -2, adaptability: -1 },
          },
          {
            id: "c",
            line: "Oh — just an intern. Nothing important.",
            register: "Shrinking",
            accuracy: 96,
            culturalFit: 38,
            relationship: -6,
            reaction: "awkward",
            reply: "…Okay. Well. This is my floor.",
            verdict: "costly",
            insight:
              "Modesty here reads as “don't bother with me”. Shrinking is a quiet way of leaving the conversation early.",
            attributes: { confidence: -3, cultural: -1 },
          },
        ],
      },
    ],
  },

  {
    id: "seoul-dinner",
    index: 4,
    city: "Seoul",
    region: "South Korea",
    flag: "KR",
    title: "Declining an invitation",
    setting: "Team dinner. Your manager is older, and has just picked up the bottle.",
    tension: "Seniority & the group",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "Jihoon, your desk neighbour",
      channel: "Message · an hour before dinner",
      body: "dinner at 7, Mr. Han is coming. small heads up from someone who learned the hard way: he pours for people he likes. and he notices who pours back. also — don't take the glass with one hand.",
      question: "What is Jihoon actually teaching you?",
      options: [
        {
          id: "a",
          text: "The rules of drinking at a Korean work dinner.",
          note: "Close, but the rules are only the surface. What he is pointing at is what those gestures *say* about you.",
        },
        {
          id: "b",
          text: "That tonight, gestures will carry more meaning than sentences.",
          correct: true,
          note: "Every item in his message is a movement, not a word. He is telling you that the language of this table is physical — and that it is being read.",
        },
        {
          id: "c",
          text: "That Mr. Han is difficult to get along with.",
          note: "Nothing in the message says that. “He pours for people he likes” describes an offer, not a warning about a person.",
        },
      ],
    },
    npc: {
      name: "Mr. Han",
      role: "Team manager · 15 years your senior",
      relationship: 65,
      character: {
        skin: "#e6bd93",
        hair: "#1f1a17",
        hairStyle: "crop",
        outfit: "#3a2115",
        collar: "#f4ede1",
      },
    },
    note: "Receiving with two hands, turning slightly when you drink, returning the gesture — these are sentences without words. Learners often master the vocabulary and miss the choreography around it.",
    ending: {
      ideal:
        "He tells the table you have good manners, which in this room means: this one is ours. The rest of dinner is easy.",
      workable:
        "Nothing goes wrong. Two juniors notice the pause, and neither of them mentions it.",
      costly:
        "The conversation moves on without you in it. You will be invited next time, and seated further away.",
    },
    beats: [
      {
        id: "s1",
        stage: "He holds the bottle over your glass and waits.",
        prompt: "Here — you've worked hard this month. Let me pour you one.",
        choices: [
          {
            id: "a",
            line: "(Receives with both hands) Thank you — may I pour for you as well?",
            register: "Reciprocal · seniority-aware",
            accuracy: 93,
            culturalFit: 97,
            relationship: 8,
            reaction: "happy",
            reply: "Ah, you've been paying attention. Good, good. Sit, sit.",
            verdict: "ideal",
            insight:
              "The gesture carried more meaning than the sentence. You closed the loop of the exchange instead of only receiving.",
            attributes: { respect: 4, cultural: 3, context: 2 },
          },
          {
            id: "b",
            line: "Oh, thanks! (takes the glass with one hand)",
            register: "Friendly · gesture mismatch",
            accuracy: 96,
            culturalFit: 55,
            relationship: -3,
            reaction: "neutral",
            reply: "Mm. …Anyway. How is the new project?",
            verdict: "workable",
            insight:
              "Nothing you said was wrong. The body language contradicted the words, and in this room the body speaks louder.",
            attributes: { cultural: -1, context: -1, confidence: 1 },
          },
          {
            id: "c",
            line: "No thanks, I don't drink.",
            register: "Honest · unsoftened",
            accuracy: 98,
            culturalFit: 46,
            relationship: -6,
            reaction: "awkward",
            reply: "Ah— of course, of course. …(the table goes quiet for a beat)",
            verdict: "workable",
            insight:
              "The boundary is legitimate; the delivery left him exposed in front of the group. A reason and a counter-offer would have protected everyone.",
            attributes: { confidence: 2, empathy: -2, adaptability: -1 },
          },
        ],
      },
      {
        id: "s2",
        stage: "He refills two glasses and lowers his voice under the table noise.",
        prompt: {
          ideal: "Now — honestly. Is the team treating you well?",
          workable: "…So. Is the team treating you well?",
          costly: "…Right. Well. The team is treating you well?",
        },
        choices: [
          {
            id: "a",
            line: "Very well — Jihoon stayed late twice to walk me through the handover.",
            register: "Warm · credits a junior",
            accuracy: 95,
            culturalFit: 93,
            relationship: 5,
            reaction: "happy",
            reply: "I'll tell him you said that. He'll pretend it was nothing.",
            verdict: "ideal",
            insight:
              "You answered warmly and spent the moment on someone else's reputation. Praise that travels upward through you costs nothing and buys a lot.",
            attributes: { empathy: 3, respect: 2, cultural: 2 },
          },
          {
            id: "b",
            line: "Honestly? Some people ignore my messages for days.",
            register: "Candid · wrong venue",
            accuracy: 97,
            culturalFit: 48,
            relationship: -3,
            reaction: "surprised",
            reply: "…Ah. We can talk about that. Not here.",
            verdict: "workable",
            insight:
              "The complaint may be fair; the venue wasn't. At the table, a private problem becomes the whole group's problem.",
            attributes: { confidence: 2, context: -2, cultural: -1 },
          },
          {
            id: "c",
            line: "It's fine.",
            register: "Closed",
            accuracy: 99,
            culturalFit: 51,
            relationship: -2,
            reaction: "neutral",
            reply: "Mm. Fine.",
            verdict: "workable",
            insight:
              "A closed answer to an open question. He lowered his voice to make room for you and you declined it politely.",
            attributes: { context: -1, empathy: -1 },
          },
        ],
      },
    ],
  },

  {
    id: "jakarta-invitation",
    index: 5,
    city: "Jakarta",
    region: "Indonesia",
    flag: "ID",
    title: "Asking for help — and being asked",
    setting: "Your neighbour catches you at the gate. You already have plans on Sunday.",
    tension: "Politeness & familiarity",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "Neighbourhood group chat",
      channel: "Two messages, ten minutes apart",
      body: "Bu Ratna: “Sunday, small gathering at my place. Everyone is welcome ya.”\n\nA friend, privately: “fyi she has asked you three times this month. she won't ask a fourth.”",
      question: "What is Bu Ratna checking with this invitation?",
      options: [
        {
          id: "a",
          text: "Whether I am free on Sunday.",
          note: "Sunday is the surface. A calendar is rarely what a third invitation is asking about.",
        },
        {
          id: "b",
          text: "Whether the relationship is still open.",
          correct: true,
          note: "Your friend's aside is the key: a fourth invitation is not coming. What is being tested is not your schedule but whether you are still inside the circle.",
        },
        {
          id: "c",
          text: "Whether I will bring something to the gathering.",
          note: "Contributing matters later, but it is not the question being asked here. Nothing in the message is about food.",
        },
      ],
    },
    npc: {
      name: "Bu Ratna",
      role: "Neighbour · sees you every day",
      relationship: 74,
      character: {
        skin: "#c98d63",
        hair: "#2a201c",
        hairStyle: "bun",
        outfit: "#b24c3c",
        collar: "#f4ede1",
      },
    },
    note: "Where relationships are maintained daily rather than scheduled, a soft “maybe” can be a complete sentence. What is being negotiated is rarely the calendar — it is whether the relationship is still open.",
    ending: {
      ideal:
        "Food arrives at your door on Sunday anyway. That is how you know the answer was accepted.",
      workable:
        "She waves at the gate tomorrow, the same as always. Slightly briefer than always.",
      costly:
        "She stops asking. The greetings stay warm and the invitations quietly stop, and no one will ever explain why.",
    },
    beats: [
      {
        id: "j1",
        stage: "She is holding two plastic bags and smiling at you expectantly.",
        prompt: "We're having a small gathering on Sunday. You'll come, right?",
        choices: [
          {
            id: "a",
            line: "I'd love to — Sunday is difficult for me, but may I stop by afterwards to say hello?",
            register: "Soft decline · relationship-first",
            accuracy: 95,
            culturalFit: 95,
            relationship: 5,
            reaction: "happy",
            reply: "Of course, of course! Come any time — there will still be food.",
            verdict: "ideal",
            insight:
              "You declined the event and accepted the relationship. Those were two different questions, and only one of them was really being asked.",
            attributes: { empathy: 3, cultural: 3, context: 2 },
          },
          {
            id: "b",
            line: "No, I can't. I have other plans.",
            register: "Clear · flat",
            accuracy: 99,
            culturalFit: 38,
            relationship: -8,
            reaction: "disappointed",
            reply: "Oh… yes. Of course. Another time, then.",
            verdict: "costly",
            insight:
              "Efficient and true — and it landed as “you are not a priority”. Clarity without warmth reads as a rejection of the person, not the plan.",
            attributes: { empathy: -3, cultural: -2, confidence: 1 },
          },
          {
            id: "c",
            line: "Yes, definitely! I'll be there!",
            register: "Agreeable · unreliable",
            accuracy: 97,
            culturalFit: 60,
            relationship: 2,
            reaction: "warm",
            reply: "Wonderful! I'll save you a seat at the front.",
            verdict: "workable",
            insight:
              "You bought warmth today with a debt due Sunday. Saying yes to avoid discomfort is a delayed cost, not a solved problem.",
            attributes: { confidence: -2, empathy: 1, context: -2 },
          },
        ],
      },
      {
        id: "j2",
        stage: "She shifts the bags to one hand. She is not finished.",
        prompt: {
          ideal: "Good, good. But tell me a day — when will you actually come?",
          workable: "Then when? You always say another time.",
          costly: "…You are always busy lately. When, then?",
        },
        choices: [
          {
            id: "a",
            line: "Wednesday evening? I'll bring the cake my mother taught me to make.",
            register: "Specific · reciprocal",
            accuracy: 95,
            culturalFit: 94,
            relationship: 5,
            reaction: "happy",
            reply: "Now that is a proper answer. Wednesday! I'll tell my daughter.",
            verdict: "ideal",
            insight:
              "You turned vague warmth into a plan and offered to contribute. Reciprocity is the currency; the cake is the receipt.",
            attributes: { empathy: 2, cultural: 3, context: 2 },
          },
          {
            id: "b",
            line: "I'll let you know.",
            register: "Deferred · reads as no",
            accuracy: 98,
            culturalFit: 39,
            relationship: -6,
            reaction: "disappointed",
            reply: "…Of course. Whenever you have time.",
            verdict: "costly",
            insight:
              "“I'll let you know” is a polite no in most languages. She heard the no — she simply won't say that she did.",
            attributes: { empathy: -2, context: -2 },
          },
          {
            id: "c",
            line: "Any day is fine — whatever is easiest for you.",
            register: "Deferential · unhelpful",
            accuracy: 97,
            culturalFit: 63,
            relationship: 0,
            reaction: "neutral",
            reply: "Ha! Then I will choose for you. Wednesday.",
            verdict: "workable",
            insight:
              "Endless flexibility hands the work back to the host. Deference can quietly become one more thing for them to carry.",
            attributes: { adaptability: 1, context: -1 },
          },
        ],
      },
    ],
  },

  {
    id: "paris-disagree",
    index: 6,
    city: "Paris",
    region: "France",
    flag: "FR",
    title: "Joining a conversation",
    setting: "A dinner debate already in progress. Your host has just made a claim you think is wrong.",
    tension: "Social nuance & debate",
    requires: "Connector",
    skills: ["reading", "listening", "speaking", "culture"],
    brief: {
      from: "Étienne",
      channel: "Message · two days before dinner",
      body: "Dinner Friday, 8pm. Bring wine if you insist, but mostly bring an opinion — we already have enough people at that table who agree with me.",
      question: "What kind of evening is he describing?",
      options: [
        {
          id: "a",
          text: "A relaxed dinner where I should avoid controversy.",
          note: "He wrote the opposite in plain words. Avoiding controversy would be the impolite choice at this table.",
        },
        {
          id: "b",
          text: "One where disagreeing with him is how you are welcomed.",
          correct: true,
          note: "“Enough people who agree with me” is an invitation, not a complaint. Here, an argument is the form attention takes.",
        },
        {
          id: "c",
          text: "A test to see whether I know enough to belong.",
          note: "Knowledge is not the entry fee — willingness is. He asked for an opinion, not for credentials.",
        },
      ],
    },
    npc: {
      name: "Étienne",
      role: "Host · enjoys an argument",
      relationship: 60,
      character: {
        skin: "#efd0b4",
        hair: "#4a3527",
        hairStyle: "wave",
        outfit: "#3d6b8c",
        collar: "#f4ede1",
        glasses: true,
      },
    },
    note: "At some tables, disagreement is a form of attention: taking someone's idea seriously enough to push on it. Silent agreement can read as politeness — or as boredom. What stays off-limits is the person.",
    ending: {
      ideal:
        "You are still arguing at midnight and someone has opened another bottle. You will be invited to the next one.",
      workable:
        "The conversation carries on around you, pleasant and slightly out of reach.",
      costly:
        "The table gets very interested in the cheese. Someone changes the subject for you.",
    },
    beats: [
      {
        id: "p1",
        stage: "He gestures with his glass, addressing the whole table but watching you.",
        prompt: "Obviously subtitles ruin a film. Everyone agrees.",
        choices: [
          {
            id: "a",
            line: "Not everyone — I'd argue dubbing ruins more. You lose the actor's actual voice.",
            register: "Engaged · counter-argument",
            accuracy: 96,
            culturalFit: 94,
            relationship: 6,
            reaction: "happy",
            reply: "Ha! Finally, someone at this table with an opinion. Defend it.",
            verdict: "ideal",
            insight:
              "You disagreed with the idea and offered something to argue against. That is the invitation being accepted.",
            attributes: { confidence: 3, cultural: 2, context: 2, adaptability: 1 },
          },
          {
            id: "b",
            line: "You're right, of course.",
            register: "Deferential · closed",
            accuracy: 99,
            culturalFit: 40,
            relationship: -4,
            reaction: "neutral",
            reply: "…Mm. (He turns to someone else.)",
            verdict: "costly",
            insight:
              "Agreement ended the game he was inviting you into. Politeness can be read as disinterest.",
            attributes: { confidence: -2, context: -2 },
          },
          {
            id: "c",
            line: "That's a ridiculous thing to say.",
            register: "Attacks the speaker",
            accuracy: 94,
            culturalFit: 44,
            relationship: -9,
            reaction: "angry",
            reply: "Ridiculous? Careful — you're a guest at my table.",
            verdict: "costly",
            insight:
              "The line moved from the idea to the person. Debate cultures guard that difference more fiercely, not less.",
            attributes: { empathy: -3, respect: -2, confidence: 1 },
          },
        ],
      },
      {
        id: "p2",
        stage: "The table has gone quiet. This is your turn, and everyone knows it.",
        prompt: {
          ideal: "Go on then. Why should I care about the actor's actual voice?",
          workable: "Well? You started something. Finish it.",
          costly: "Please. Explain to me what I've said that is so ridiculous.",
        },
        choices: [
          {
            id: "a",
            line: "Because half a performance is rhythm — and you cannot dub rhythm.",
            register: "Escalates the idea",
            accuracy: 96,
            culturalFit: 95,
            relationship: 6,
            reaction: "happy",
            reply: "…Fine. Fine! You may stay for dessert.",
            verdict: "ideal",
            insight:
              "You raised the level of the argument instead of the volume. That is exactly the move the table was waiting for.",
            attributes: { confidence: 3, context: 2, cultural: 2 },
          },
          {
            id: "b",
            line: "I don't know. I just think so.",
            register: "Unsupported",
            accuracy: 95,
            culturalFit: 40,
            relationship: -5,
            reaction: "disappointed",
            reply: "Then you don't think so. You feel so. Different thing.",
            verdict: "costly",
            insight:
              "A claim with nothing behind it ends the exchange. Here, an opinion without an argument reads as not having one.",
            attributes: { confidence: -2, context: -1 },
          },
          {
            id: "c",
            line: "Do you always have to win?",
            register: "Turns on the person",
            accuracy: 97,
            culturalFit: 32,
            relationship: -8,
            reaction: "angry",
            reply: "I want a conversation. You're offering an accusation.",
            verdict: "costly",
            insight:
              "You moved from the topic to his character — the one line this kind of table does not cross.",
            attributes: { empathy: -3, respect: -2 },
          },
        ],
      },
    ],
  },
];
