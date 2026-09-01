# Noera — Learn the language. Understand the moment.

Submission for **PNBWDC IntechFest 2026 — Web Design Competition**
Theme: *Education Technology: Language Learning for Global Community*

> "Language is not only about knowing the words. It is about knowing the right
> words for the right person, context, culture, and moment."

Noera is an illustrated **social simulation** for language learners. You do not
translate sentences — you walk into a room, someone speaks to you, and you pick
what you would actually say. Then you watch what it did to them.

---

## The mechanic: Social Consequence

Every choice returns three readings instead of "correct / incorrect". These are
the actual numbers from the landing-page hero, where both options are
grammatically sound:

| | Language accuracy | Cultural fit | Relationship |
| --- | --- | --- | --- |
| *"Of course — I'll have it to you by tonight."* | 97% | 94% | +5 |
| *"Yeah, sure, whenever I get to it."* | 98% | 31% | −9 |

Accuracy is near-identical; the outcome is not. That gap is the whole product.
Accuracy is deliberately rendered in neutral ink while the other two carry
colour — because it is not the number that decides anything.

The NPC's face changes **before** the numbers appear: the reaction is immediate,
the readings follow at 550 ms in the hero and 700 ms in a full scenario, and the
explanation at 1700 ms. Feel first, read second. A grammatically flawless
sentence can still cost you a relationship, and the learner is told exactly why
in one sentence, plus a cultural note.

Progression is **Social Reputation**, not XP: six communication attributes
(Respect, Empathy, Adaptability, Context, Confidence, Cultural Awareness) that
move only because a person in a scenario reacted to something you said. Tiers:
Newcomer → Observer → Adapter → Connector → Global Citizen. Each tier opens a
different *kind* of room, not a badge — Connector unlocks repair scenarios,
conversations that begin already damaged.

**Global Challenge** is the community mechanic: one situation a week, every
learner, the same three seconds. Commit to your answer and the split opens —
overall, then by region, each with a learner explaining why their answer felt
obvious. Regional data is always framed as tendencies among the people who
answered, never as a claim about who anyone is.

**The Daily Room** is the reason to return: one new social situation each day,
then a countdown to tomorrow's. No streak to protect, nothing lost by missing a
day.

## One conversation, six stages

Every room runs the same loop, and the stage marker names where you are:

**Baca** (read) → **Dengar** (listen) → **Pilih** (choose) → **Akibat**
(consequence) → **Kenapa** (why) → **Ucapkan** (speak)

Each of the six scenarios trains four skills, declared per scenario in
`lib/kairos/scenarios.ts`:

| Skill | Where it happens |
| --- | --- |
| Reading | "Read the room" — a message arrives; answer what is *actually* being asked, not what the vocabulary says |
| Listening | "Hear how he says it" — `speechSynthesis` reads the line aloud |
| Speaking | Say the sentence into the microphone — `SpeechRecognition` |
| Culture | The cultural note after every consequence |

The reply options stay hidden until you commit a prediction about the reaction.
Showing both at once turns the exercise into "guess the answer" instead of
"read the room".

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing — hero exchange, the insight, the consequence mechanic, an interactive comic, community, the journey map, reputation, CTA |
| `/learn` | The simulation: 6 scenarios across Tokyo, Berlin, New York, Seoul, Jakarta, Paris |
| `/community` | Weekly Global Challenge, regional perspective polls, field notes |
| `/signin`, `/signup` | Deliberately quiet — the product starts on the other side |

Responsive targets verified at **393×852**, **820×1180** and **1440×1024**:
no horizontal overflow and no console errors on any of the five routes at any
of the three sizes. Below 1024 px the main navigation moves to a bottom bar
within thumb reach; the top bar keeps only the wordmark and the language
toggle.

## Language

The interface is **Indonesian by default**, with an ID/EN toggle in the navbar
and footer. The choice is remembered in the browser.

What deliberately stays in English: the sentences characters speak, the three
reply options, and the message read during "Read the room". That is the
material being practised — translating it would delete the lesson. Every
explanation, cultural note and piece of interface copy is fully translated.

## For judges: one-click demo login

On **/signin** (and **/signup**) there is an **"Explore a sample profile"**
button — no password, no form. It loads a profile that already sits mid-journey
(two conversations lived, two relationships carrying history, Adapter-level
social reputation) and lands directly on the scenario rather than the top of
the page. Today's Daily Room and the Global Challenge are deliberately left
unanswered so both reveals still happen live in front of you. The normal
email/password form is untouched, directly below it.

## Accessibility

- Every interactive element has a visible keyboard focus ring (2 px ember,
  3 px offset) that appears instantly — it is explicitly excluded from the
  colour transitions, so it never fades in wearing the text colour.
- The three consequence readings sit in an `aria-live="polite"` region, so the
  part that actually changes is announced; the rest of the page is not.
- `prefers-reduced-motion` is honoured throughout, including the reveal pacing:
  reduced-motion users get the reaction and the numbers at once, because the
  delay is a pacing device and pacing is what they opted out of.
- One `<h1>` per page, labels tied to inputs, 44 px minimum touch targets.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Use a recent Chrome or Edge. Listening and speaking use the browser's built-in
Web Speech API; if the microphone is denied or unsupported, the speaking step
degrades to a read-aloud prompt and nothing breaks.

Do not run `npm run dev` and `npm run build` at the same time — both write to
`.next/`, and `tsconfig.json` includes the dev-generated types, so a concurrent
build can read a half-written file and fail.

No backend, no API keys, no database. Progress (attributes, completed
scenarios, relationships) lives in `localStorage` under `kairos.progress.v2`
and can be cleared from the Social Reputation panel.

## Structure

```
app/                     routes: page.tsx, learn, community, signin, signup
  globals.css            design tokens, focus ring, grain, motion
components/kairos/
  Character.tsx          parametric hand-drawn actor: 10 expressions,
                         blink / breathe / talk, reaction-driven
  HeroExchange.tsx       the 10-second version of the product, in the hero
  ScenarioPlayer.tsx     read → listen → choose → consequence → why → speak
  LearningSpine.tsx      the six-stage marker, in both narrative and inline form
  ReadTheRoom.tsx        commit a prediction before the options appear
  ScenarioBrief.tsx      the message that got you into the room
  Listen.tsx             speechSynthesis, with a silent fallback
  SpeakPractice.tsx      SpeechRecognition, with a permission-denied path
  RetryCompare.tsx       say it differently, and compare the two attempts
  DeliveryReflection.tsx name how you delivered it, after you said it
  CulturalBasis.tsx      why the room reads it that way
  ConsequenceComic.tsx   choice → reaction → consequence → next scene, in frames
  GlobalChallenge.tsx    one situation, every learner, commit-then-reveal
  PerspectivePoll.tsx    commit-then-reveal regional perspectives
  DailyRoom.tsx          today's situation + countdown to the next one
  WorldMap.tsx           the journey: six social systems on one route
  SocialPortrait.tsx     the communication profile, in sentences not bars
  TierUp.tsx             the moment a tier opens, and what it opens
  Onboarding.tsx         five-step tour that points at the real elements
  RouteTransition.tsx    paper-curtain page transition
  BottomBar.tsx          thumb-reach navigation below 1024 px
  Ink.tsx                the hand-drawn layer: notes, arrows, circled emphasis,
                         and the reaction marks drawn around a character
  Meters.tsx, Flag.tsx, ui.tsx, SiteShell.tsx, AuthShell.tsx
components/motion/       motion primitives
lib/kairos/              scenarios, polls, destinations, types, i18n,
                         localStorage state
scripts/                 package-submission.mjs — builds the submission ZIP
```

`kairos` is the project's internal module namespace and storage key, kept
stable so saved progress survives; the product is Noera throughout.

Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion.
`npx tsc --noEmit` is clean and `npm run build` prerenders all six routes with
no warnings. Flags, characters, icons and every illustration are hand-built
SVG; the only raster file in the repository is `app/favicon.ico`. There are no
photographs and no image dependencies.

## Design notes

Warm cream ground (`#fbf8f3`), deep espresso section breaks, ember accent,
rounded cards, pill eyebrows, generous whitespace, torn/organic section edges,
an oversized wordmark marquee.

Roughly 80% clean editorial UI, 20% hand-drawn interaction language: Caveat is
used only for margin notes, stage directions and reaction labels — never for UI
copy or body text. Fraunces carries display type.

The consequence palette is restrained and semantic rather than decorative —
sage means it landed, clay means it survives, rose means it cost you — and
every animation is tied to a social signal, so no motion exists for its own
sake. Flags are drawn in SVG because emoji flags do not render on Windows
browsers.

Card dividers are drawn as cell borders rather than as a 1 px grid gap showing
the background through: three columns of 1320 px land on fractional widths, and
a fractional gap can fall between two device pixels and disappear entirely on
one divider but not the other.
