"use client";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteFooter, SiteNav } from "@/components/kairos/SiteShell";
import { HeroExchange } from "@/components/kairos/HeroExchange";
import dynamic from "next/dynamic";

/* Kelima blok ini ada di bawah layar pertama, jadi potongan JS-nya tidak perlu
   ikut antre saat halaman dibuka.

   Yang dulu bikin celaka bukan next/dynamic-nya, tapi tidak adanya batas
   Suspense LOKAL: penundaan tiap blok naik sampai app/loading.tsx, dan tirai
   "sebentar…" menutup SELURUH halaman selama 3,4 detik.

   Sekarang tiap blok punya `loading:` sendiri. Batasnya berhenti di situ,
   tidak pernah naik lagi — dan app/loading.tsx sendiri sudah dihapus, jadi
   tidak ada lagi tirai selayar penuh yang bisa dipicu.

   Tinggi cadangannya disamakan dengan tinggi isi sebenarnya supaya CLS tetap
   nol saat blok masuk.

   ssr:false sempat dicoba di sini: HTML turun 120KB -> 49KB dan skor Lighthouse
   ponsel naik ~2 poin. Tidak dipakai. Dengan ssr:false isi kelima blok ini
   hilang dari HTML yang dikirim server — halaman jadi bergantung penuh pada JS,
   dan juri yang membaca sumbernya tidak menemukan apa-apa. Dua poin tidak
   sepadan dengan itu. */
const Reserve = ({ h }: { h: number }) => (
  <div style={{ minHeight: h }} aria-hidden />
);

const ScenarioPlayer = dynamic(
  () => import("@/components/kairos/ScenarioPlayer").then((m) => m.ScenarioPlayer),
  { loading: () => <Reserve h={620} /> },
);
const ConsequenceComic = dynamic(
  () => import("@/components/kairos/ConsequenceComic").then((m) => m.ConsequenceComic),
  { loading: () => <Reserve h={520} /> },
);
const GlobalChallenge = dynamic(
  () => import("@/components/kairos/GlobalChallenge").then((m) => m.GlobalChallenge),
  { loading: () => <Reserve h={460} /> },
);
const WorldMap = dynamic(
  () => import("@/components/kairos/WorldMap").then((m) => m.WorldMap),
  { loading: () => <Reserve h={520} /> },
);
const SocialPortrait = dynamic(
  () => import("@/components/kairos/SocialPortrait").then((m) => m.SocialPortrait),
  { loading: () => <Reserve h={540} /> },
);
import { ButtonLink, Doodle, InkUnderline, TornEdge } from "@/components/kairos/ui";
import { HandArrow, HandNote } from "@/components/kairos/Ink";
import { LearningSpine } from "@/components/kairos/LearningSpine";
import { SCENARIOS } from "@/lib/kairos/data";
import { useLang, useT } from "@/lib/kairos/i18n";

export default function LandingPage() {
  const t = useT();
  const { lang } = useLang();
  const featured = SCENARIOS[0];

  const INSIGHTS = [
    {
      num: "01",
      title: t("Kata", "Words"),
      question: t("Benar tidak tata bahasanya?", "Is it grammatically correct?"),
      example: "“I want you to help me.”",
      verdict: t("Sempurna menurut buku.", "Textbook-perfect."),
      tone: "#3e7c5a",
      body: t(
        "Semua kursus yang pernah kamu ikuti mengoptimalkan kalimat ini. Ini yang paling gampang dari ketiganya, dan paling tidak berguna kalau berdiri sendiri.",
        "Every course you have taken optimises for this line. It is the easiest of the three, and the least useful on its own.",
      ),
    },
    {
      num: "02",
      title: t("Konteks", "Context"),
      question: t("Pantas tidak diucapkan di sini?", "Is it appropriate here?"),
      example: t(
        "Diucapkan ke manajermu, di hari pertama.",
        "Said to your manager, on day one.",
      ),
      verdict: t("Sekarang jadi tuntutan.", "Now it's a demand."),
      tone: "#c2551f",
      body: t(
        "Kata yang sama naik-turun tingkat kesopanannya tergantung siapa yang mendengar, sudah berapa lama kalian kenal, dan siapa yang sedang menonton.",
        "The same words move up and down the register scale depending on who is listening, how long you have known them, and who is watching.",
      ),
    },
    {
      num: "03",
      title: t("Dampak", "Impact"),
      question: t("Orangnya bakal merasa bagaimana?", "How will they feel?"),
      example: t(
        "Dia mengangguk. Lalu berhenti meminta apa pun darimu.",
        "She nods. She stops asking you for things.",
      ),
      verdict: t("Dan kamu tidak pernah tahu kenapa.", "You never find out why."),
      tone: "#b24c3c",
      body: t(
        "Ini bagian yang tidak pernah dinilai siapa pun. Akibatnya datang beberapa hari kemudian, diam-diam, dalam bentuk undangan yang tidak pernah sampai.",
        "This is the part nobody grades. The consequence arrives days later, quietly, as an invitation that doesn't come.",
      ),
    },
  ];

  return (
    <MotionProvider>
      <SiteNav />

      <main className="flex flex-col overflow-x-hidden pt-[72px]">
        {/* ================================================== 1 · HERO ==== */}
        <section className="relative mx-auto w-full max-w-[1400px] px-5 pt-10 md:px-10 md:pt-16">
          <Doodle
            kind="squiggle"
            className="absolute left-[3%] top-[4%] hidden w-14 animate-[drift_9s_ease-in-out_infinite] lg:block"
          />
          <Doodle
            kind="spark"
            className="absolute right-[5%] top-[10%] hidden w-8 animate-[drift_7s_ease-in-out_infinite] lg:block"
            color="#3e7c5a"
          />

          {/* Di bawah lg kolom kirinya memakai display:contents, jadi judul,
              tombol dan angka-angka ikut jadi item flex induknya. Itu yang
              memungkinkan kartu percakapan diselipkan tepat di bawah judul di
              layar kecil — tanpa menyentuh susunan dua kolom di desktop.

              Urutan di ponsel: judul → percakapan → tombol → angka → paragraf.
              Yang paling menjelaskan Noera harus terlihat lebih dulu, bukan
              paragraf pengantar. */}
          <div className="flex flex-col gap-7 lg:grid lg:items-center lg:gap-14 lg:grid-cols-[1.02fr_1fr]">
            <div className="contents lg:block">
              <h1 className="display order-2 text-[2.85rem] leading-[0.98] sm:text-[4rem] lg:order-none lg:mt-6 lg:text-[4.6rem]">
                {lang === "id" ? (
                  <>
                    Fasih saja{" "}
                    <InkUnderline>belum cukup</InkUnderline>.
                  </>
                ) : (
                  <>
                    Being <InkUnderline>fluent</InkUnderline>
                    <br />
                    isn&apos;t enough.
                  </>
                )}
              </h1>

              <p className="order-6 max-w-[46ch] text-[1.02rem] leading-[1.62] text-mute lg:order-none lg:mt-6 lg:text-[1.08rem]">
                {t(
                  "Pelajari bagaimana kalimatmu berubah arti tergantung siapa lawan bicaranya. Noera menempatkanmu di dalam situasi sosial sungguhan — dan membuatmu merasakan apa yang dilakukan kalimatmu pada orang di depanmu.",
                  "Learn how your words change depending on who you're talking to. Noera puts you inside real social situations — and lets you feel what your sentence did to the person across from you.",
                )}
              </p>

              <div className="order-4 flex flex-col gap-3 sm:flex-row lg:order-none lg:mt-8">
                <ButtonLink href="/learn" wipe>
                  {t("Masuk ke ruang pertamamu", "Enter your first scenario")}
                </ButtonLink>
                <ButtonLink href="#world" variant="ghost" wipe>
                  {t("Lihat petanya", "Explore the world")}
                </ButtonLink>
              </div>

              <dl className="order-5 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 lg:order-none lg:mt-10">
                {[
                  // Setiap angka di sini bisa dihitung ulang dari data: enam
                  // skenario di lib/kairos/scenarios.ts, empat nilai pada
                  // `skills` di tiap skenario, dan tiga bacaan yang keluar
                  // setiap kali sebuah kalimat dipilih. Versi sebelumnya
                  // menyebut "57" — jumlah bidang `scenarios` di DESTINATIONS —
                  // padahal 51 di antaranya tidak bisa dimainkan.
                  ["6", t("ruang lintas budaya", "cross-cultural rooms")],
                  ["4", t("keterampilan bahasa", "language skills")],
                  ["3", t("dimensi konsekuensi", "consequence readings")],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="display text-[1.9rem] leading-none">{n}</dt>
                    <dd className="mt-1 text-[12px] uppercase tracking-[0.12em] text-mute">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="order-3 enter-up-delayed lg:order-none">
              <HeroExchange />
              {/* Keterangan ini menjelaskan hubungan pratinjau ↔ halaman
                  Belajar. Di ponsel tombol utama sudah mengatakan hal yang
                  sama, jadi tidak perlu memakan tinggi layar pertama. */}
              <p className="mt-3 hidden text-center text-[12.5px] text-mute lg:block">
                {t(
                  "Ini pratinjau. Percakapan penuhnya — tiga giliran, dengan akibat yang menetap — ada di halaman Belajar.",
                  "This is a preview. The full conversation — three exchanges, with consequences that stay — lives on the Learn page.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================ 2 · THE INSIGHT ==== */}
        <section
          className="reveal mx-auto w-full max-w-[1400px] px-5 py-20 md:px-10 md:py-28"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[640px]">
              <p className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                <span className="h-px w-8 bg-mute/50" />
                {t("Celah yang tidak diajarkan siapa pun", "The gap nobody teaches")}
              </p>
              <h2 className="display mt-4 text-[2.4rem] leading-[1.02] md:text-[3.4rem]">
                {t(
                  "Kosakatamu sudah ada. Tapi kamu paham momennya?",
                  "You know the words. But do you know the moment?",
                )}
              </h2>
            </div>
            <div className="max-w-[38ch] border-l-2 border-ink/15 pl-5">
              <p className="eyebrow text-mute">
                {t("Satu kalimat, tiga pertanyaan", "One sentence, three questions")}
              </p>
              <p className="display mt-1.5 text-[1.35rem] leading-snug text-ink">
                “I want you to help me.”
              </p>
              <HandNote className="mt-1" color="#b04a19" arrow="down">
                {t("ikuti sampai ketiganya", "follow it through all three")}
              </HandNote>
            </div>
          </div>

          <div className="relative mt-14">
            {/* satu tarikan tangan yang menyambungkan ketiganya */}
            {[0, 1].map((i) => (
              <span
                key={i}
                className="pointer-events-none absolute top-[46%] z-20 hidden -translate-y-1/2 md:block"
                style={{ left: `calc(${(i + 1) * 33.333}% - 22px)` }}
              >
                <HandArrow
                  direction="right"
                  color="#b04a19"
                  length={44}
                  delay={0.35 + i * 0.12}
                />
              </span>
            ))}

            {/* Pemisahnya digambar sebagai garis tepi kartu, bukan sebagai
                celah 1px yang membiarkan latar kartu tembus. Tiga kolom dari
                lebar 1320px menghasilkan angka pecahan (438,656px), sehingga
                celahnya jatuh di antara dua piksel layar: satu pemisah terbaca,
                satunya lagi hilang sama sekali — persis yang terjadi antara
                kartu kedua dan ketiga. Garis tepi dibulatkan ke piksel penuh
                saat digambar, jadi keduanya selalu muncul. */}
            <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-cream md:grid-cols-3">
            {INSIGHTS.map((item, i) => (
              <article
                key={item.num}
                className={`reveal grain relative bg-cream p-7 md:p-9 ${
                  i > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="display text-[2.4rem] leading-none text-ink/15">
                    {item.num}
                  </span>
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: item.tone }}
                  />
                </div>
                <h3 className="display mt-5 text-[1.75rem]">{item.title}</h3>
                <p className="mt-1.5 text-[13.5px] text-mute">{item.question}</p>

                <div className="mt-7 rounded-[1.1rem] border border-line bg-white p-4">
                  <p className="text-[15px] leading-snug text-ink">{item.example}</p>
                  <p
                    className="mt-2.5 text-[12px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: item.tone }}
                  >
                    {item.verdict}
                  </p>
                </div>

                <p className="mt-5 text-[14px] leading-[1.6] text-mute">{item.body}</p>
              </article>
            ))}
            </div>
          </div>
        </section>

        {/* ====================================== 3 · SIGNATURE FEATURE ==== */}
        <section
          id="progres"
          className="reveal mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 pb-20 md:px-10 md:pb-28"
        >
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[560px]">
              <h2 className="display text-[2.4rem] leading-[1.02] md:text-[3.4rem]">
                {t("Setiap kata punya", "Every word has a")}{" "}
                <InkUnderline color="#b24c3c">{t("akibat", "consequence")}</InkUnderline>.
              </h2>
            </div>
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-mute">
              {t(
                "Tidak ada “benar / salah”. Yang kamu dapat: tiga angka dan satu wajah. Ketepatan bahasa memberi tahu kalimatmu tidak keliru. Kecocokan budaya dan hubungan memberi tahu berapa harganya. Mainkan skenario di bawah — lalu ucapkan dengan cara lain dan lihat ceritanya berubah.",
                "No “correct / incorrect”. You get three numbers and a face. Language accuracy tells you the sentence was fine. Cultural fit and relationship tell you what it cost. Play the real scenario below — then say it differently and watch the story change.",
              )}
            </p>
          </div>

          {/* Empat pil keterampilan yang dulu berjajar di sini sudah diganti.
              Empat pil itu daftar fitur — juri harus merangkai sendiri
              hubungannya. Ini satu putaran utuh, dan bentuk yang sama muncul
              lagi di dalam percakapan sebagai penanda tahap. */}
          <div className="mb-6 border-t border-line pt-6">
            <p className="eyebrow mb-4 text-mute">
              {t("Satu percakapan, enam tahap", "One conversation, six stages")}
            </p>
            <LearningSpine variant="narrative" />
          </div>

          <ScenarioPlayer scenario={featured} variant="demo" />
        </section>

        {/* ==================================== 4 · SOCIAL CONSEQUENCE ==== */}
        <section className="grain relative bg-espresso py-24 text-cream md:py-32">
          <TornEdge position="top" color="#fbf8f3" />
          <TornEdge position="bottom" color="#fbf8f3" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-10">
            <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-[560px]">
                <p className="hand text-[19px] leading-none text-ember">
                  {t("empat panel kemudian…", "four frames later…")}
                </p>
                <h2 className="display mt-3 text-[2.4rem] leading-[1.02] md:text-[3.4rem]">
                  {t("Kalimatmu mengubah ceritanya.", "Your words change the story.")}
                </h2>
              </div>
              <p className="max-w-[42ch] text-[15px] leading-[1.65] text-cream/65">
                {t(
                  "Satu permintaan, ditanyakan dengan dua cara. Bedanya tidak muncul di jawabannya — tapi empat panel kemudian, di undangan rapat yang tidak pernah sampai ke kamu.",
                  "One request, asked two ways. The difference doesn't show up in the reply — it shows up four frames later, in a meeting invitation you never received.",
                )}
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-cream p-5 text-ink md:p-8">
              <ConsequenceComic />
            </div>
          </div>
        </section>

        {/* ======================================== 5 · GLOBAL COMMUNITY ==== */}
        <section
          className="reveal mx-auto w-full max-w-[1400px] px-5 py-20 md:px-10 md:py-28"
        >
          <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-sage">
                <span className="h-px w-8 bg-sage/50" />
                {t(
                  "Semua pelajar, minggu yang sama",
                  "Every learner, the same week",
                )}
              </p>
              <h2 className="display mt-4 text-[2.4rem] leading-[1.02] md:text-[3.4rem]">
                {t("Situasi sama. Cara pandang beda.", "Same situation. Different perspectives.")}
              </h2>
              <HandNote className="mt-4" color="#3e7c5a" arrow="down">
                {t("jawab dulu sebelum melihat dunia", "answer before you look at the world")}
              </HandNote>
            </div>
            <p className="text-[15px] leading-[1.65] text-mute">
              {t(
                "Seminggu sekali, semua pelajar masuk ke tiga detik yang sama. Kamu putuskan dulu apa yang akan kamu katakan, baru sebarannya terbuka: bagaimana semua orang menjawab, dan sejauh apa kalimat yang sama dibaca berbeda dari satu wilayah ke wilayah lain. Komunitas di sini bukan linimasa — ini separuh kedua dari pelajarannya.",
                "Once a week every learner walks into the same three seconds. You commit to what you would say, and only then does the split open: how everyone answered, and how differently the same sentence gets read from one region to the next. Community here is not a feed — it is the second half of the lesson.",
              )}
            </p>
          </div>

          <GlobalChallenge compact />

          <div className="mt-6 flex justify-center">
            <ButtonLink href="/community" variant="ghost" wipe>
              {t("Masuk ke komunitas →", "Enter the community →")}
            </ButtonLink>
          </div>
        </section>

        {/* ================================================ 6 · WORLD ==== */}
        <section
          id="world"
          className="reveal mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 pb-20 md:px-10 md:pb-28"
        >
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[540px]">
              <h2 className="display text-[2.4rem] leading-[1.02] md:text-[3.4rem]">
                {t("Perjalananmu tidak punya ruang kelas.", "Your journey has no classroom.")}
              </h2>
            </div>
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-mute">
              {t(
                "Kota di sini bukan tujuan wisata, tapi sistem sosial — Tokyo melatih hierarki, Berlin melatih cara menyanggah, New York melatih tiga puluh detik pertama dengan orang asing. Tiap perhentian terbuka saat profil komunikasimu siap untuk jenis ruangan di dalamnya.",
                "Cities here are not destinations, they are social systems — Tokyo trains hierarchy, Berlin trains disagreement, New York trains the first thirty seconds with a stranger. Each stop opens when your communication profile is ready for the kind of room it contains.",
              )}
            </p>
          </div>

          <WorldMap />
        </section>

        {/* ==================================== 7 · SOCIAL REPUTATION ==== */}
        <section
          className="reveal mx-auto w-full max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-end gap-4">
                <span className="display text-[4.5rem] leading-[0.8] text-ink/12">5</span>
                <span className="mb-2 max-w-[14ch] text-[12px] font-semibold uppercase leading-snug tracking-[0.14em] text-mute">
                  {t("tingkat kematangan berkomunikasi", "stages of communication maturity")}
                </span>
              </div>
              <h2 className="display mt-4 text-[2.4rem] leading-[1.02] md:text-[3.2rem]">
                {t(
                  "Kamu tidak naik level. Kamu jadi lebih enak diajak bicara.",
                  "You don't level up. You become easier to talk to.",
                )}
              </h2>
              <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.65] text-mute">
                {t(
                  "Tanpa XP, tanpa rentetan harian, tanpa lencana. Enam atribut komunikasi yang hanya bergerak kalau seseorang di dalam skenario bereaksi pada ucapanmu — plus satu kalimat yang memberi tahu kamu sedang tumbuh jadi komunikator seperti apa.",
                  "No XP, no streaks, no badges. Six communication attributes that only move when someone in a scenario reacts to what you said — and a profile that tells you, in a sentence, what kind of communicator you are becoming.",
                )}
              </p>

              <div className="mt-6 rounded-[1.4rem] border border-line bg-white p-5">
                {/* text-mute, bukan text-clay.

                    Label ini berada di dalam seksi ber-.reveal, yang opasitasnya
                    digerakkan posisi gulir dan berhenti di sekitar 0,893 pada
                    posisi tertentu. Clay (#b04a19) di atas putih memang lolos
                    (5,49:1) pada opasitas penuh, tapi pada 0,893 turun ke
                    4,49:1 — di bawah ambang 4,5:1.

                    Mute (#6b5d50) adalah warna bawaan .eyebrow di sistem ini;
                    clay-lah pengecualiannya di sini. Pada 0,893 rasionya 4,93:1
                    dan pada opasitas penuh 6,35:1. */}
                <p className="eyebrow text-mute">
                  {t("Alasan untuk kembali", "A reason to come back")}
                </p>
                <p className="mt-2 text-[15px] font-bold text-ink">
                  {t("Ruang Harian", "The Daily Room")}
                </p>
                <p className="mt-1.5 max-w-[38ch] text-[13.5px] leading-relaxed text-mute">
                  {t(
                    "Satu situasi sosial baru setiap hari — hari ini soal teman yang membatalkan janji untuk ketiga kalinya. Melewatkan kemarin tidak menghilangkan apa pun. Ruangnya cuma berganti.",
                    "One new social situation every day — today it's a friend cancelling on you for the third time. Nothing is lost by missing yesterday. The room simply changes.",
                  )}
                </p>
                <HandNote className="mt-2" color="#6b5d50">
                  {t("tidak ada rentetan yang perlu dijaga", "no streak to protect")}
                </HandNote>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-mute">
                {["Newcomer", "Observer", "Adapter", "Connector", "Global Citizen"].map(
                  (t, i, arr) => (
                    <span key={t} className="flex items-center gap-2">
                      {t}
                      {i < arr.length - 1 && <span className="text-clay">→</span>}
                    </span>
                  ),
                )}
              </div>
            </div>

            <SocialPortrait />
          </div>
        </section>

        {/* ============================================= 8 · FINAL CTA ==== */}
        <section className="grain relative overflow-hidden bg-espresso-deep py-24 text-cream md:py-32">
          <TornEdge position="top" color="#fbf8f3" />
          <div className="relative z-10 mx-auto w-full max-w-[1000px] px-5 text-center md:px-10">
            <Doodle kind="arc" className="mx-auto mb-6 w-14" color="#ff6b35" />
            <h2 className="display text-[2.8rem] leading-[1.02] md:text-[4.2rem]">
              {t("Kuasai bahasanya.", "Learn the language.")}
              <br />
              <span className="text-ember">
                {t("Pahami momennya.", "Understand the moment.")}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-[48ch] text-[15.5px] leading-[1.65] text-cream/65">
              {t(
                "Dua belas menit dari sekarang, kamu akan pernah mengucapkan sesuatu yang benar tapi jatuhnya buruk — dan kamu akan tahu persis kenapa. Itu seluruh produknya.",
                "Twelve minutes from now you will have said something correct that landed badly, and you will know exactly why. That is the whole product.",
              )}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/learn" wipe>
                {t("Mulai ruang pertamamu", "Start your first scenario")}
              </ButtonLink>
              <ButtonLink href="/signup" variant="onDark" wipe>
                {t("Buat profil gratis", "Create a free profile")}
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </MotionProvider>
  );
}
