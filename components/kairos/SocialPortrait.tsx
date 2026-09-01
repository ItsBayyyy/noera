"use client";

import Link from "next/link";
import { Character } from "./Character";
import { HandNote, HandArrow } from "./Ink";
import { ATTRIBUTES, curriculum, recommendedRoom, socialReadings } from "@/lib/kairos/data";
import { useProgress } from "@/lib/kairos/state";
import { useLang, useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";
import type { AttributeKey, Expression } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   POTRET SOSIAL

   Menggantikan enam meteran atribut yang dulu ada di sini.

   Meteran itu bertentangan dengan Kairos sendiri: seluruh produk ini
   mengatakan "tidak ada benar/salah, yang ada akibat" — lalu menampilkan papan
   skor enam angka. Halaman Belajar adalah halaman wajib menurut panduan lomba,
   dan itu justru bagian yang paling lama dilihat juri.

   Angkanya tetap dihitung di state (dipakai untuk memilih ruangan berikutnya),
   tapi tidak pernah lagi ditampilkan sebagai angka. Yang tampil: kalimat
   tentang bagaimana orang membaca kamu.
   -------------------------------------------------------------------------- */

const labelFor = (key: AttributeKey) =>
  ATTRIBUTES.find((a) => a.key === key)?.label ?? key;

/** Wajah yang paling sering kamu pancing keluar, dari tingkat kematanganmu. */
const FACE: Record<string, Expression> = {
  Newcomer: "confused",
  Observer: "neutral",
  Adapter: "warm",
  Connector: "happy",
  "Global Citizen": "happy",
};

export function SocialPortrait({ onDark = false }: { onDark?: boolean }) {
  const { progress, tier, completedCount, hydrated, reset } = useProgress();
  const t = useT();
  const tr = useTr();
  const { lang } = useLang();

  const readings = socialReadings(progress.attributes, lang);
  const next = recommendedRoom(progress.attributes, progress.completed, tier.name);

  /* Enam sumbu kurikulum, berikut ruangan yang mengujinya. Bukan dasbor:
     tidak ada angka, tidak ada persentase, tidak ada bilah. Hanya daftar
     redaksional — yang sudah diuji berdiri penuh, yang belum tetap terbaca. */
  const axes = curriculum(progress.completed);

  const { read, partial, missed } = progress.reads;
  const totalReads = read + partial + missed;
  const readSentence = (() => {
    if (!totalReads) return "";
    if (read >= partial + missed)
      return t(
        `Dari ${totalReads} ruangan, kamu biasanya sudah tahu apa yang akan dilakukan kalimatmu sebelum mengucapkannya.`,
        `Across ${totalReads} room${totalReads === 1 ? "" : "s"}, you usually know what your sentence will do before you say it.`,
      );
    if (missed > read)
      return t(
        `Dari ${totalReads} ruangan, kamu lebih sering membaca kata-katanya daripada situasinya — di situ jaraknya masih terasa.`,
        `Across ${totalReads} room${totalReads === 1 ? "" : "s"}, you read the words more often than the situation — that is where the gap still sits.`,
      );
    return t(
      `Dari ${totalReads} ruangan, arahnya sering kamu baca benar; reaksinya yang belum selalu tepat.`,
      `Across ${totalReads} room${totalReads === 1 ? "" : "s"}, you often read the direction right; the exact reaction is what still slips.`,
    );
  })();

  const dim = onDark ? "text-cream/70" : "text-mute";
  const strong = onDark ? "text-cream" : "text-ink";

  return (
    <div
      className={`grain relative overflow-hidden rounded-[1.75rem] border p-6 md:p-8 ${
        onDark ? "border-white/10 bg-espresso-deep text-cream" : "border-line bg-white"
      }`}
    >
      <div className="relative z-10">
        {/* ---------------------------------------------- siapa kamu sekarang */}
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className={`eyebrow ${onDark ? "text-ember" : "text-clay"}`}>
              {t("Bagaimana orang membaca kamu", "How people read you")}
            </p>
            <h3 className="display mt-2 text-[2rem] leading-none md:text-[2.5rem]">
              {hydrated ? tr(tier.name) : "—"}
            </h3>
            <p className={`mt-1.5 text-[12.5px] ${dim}`}>
              {!hydrated
                ? t("Memuat…", "Loading…")
                : completedCount === 0
                  ? t(
                      "Titik awal semua orang — belum ada percakapan yang membentuknya",
                      "Everyone's starting point — no conversations have shaped it yet",
                    )
                  : t(
                      `Dibentuk dari ${completedCount} percakapan yang kamu jalani`,
                      `Built from ${completedCount} conversation${completedCount === 1 ? "" : "s"} you lived`,
                    )}
            </p>
          </div>

          {/* wajah yang paling sering kamu pancing keluar */}
          <div className="relative shrink-0">
            <Character
              spec={{
                skin: "#e8c39a",
                hair: "#2c2320",
                hairStyle: "bob",
                outfit: onDark ? "#8a4a22" : "#3d6b8c",
                collar: "#f4ede1",
              }}
              expression={hydrated ? (FACE[tier.name] ?? "neutral") : "idle"}
              still
              size={96}
              className="h-auto w-[76px] md:w-[92px]"
            />
          </div>
        </div>

        {/* -------------------------------------------------- bacaan perilaku */}
        <ul className="mt-6 space-y-3.5">
          {readings.map((r) => (
            <li
              key={r.key}
              className={`reveal border-l-2 pl-4 ${
                r.tone === "high"
                  ? onDark
                    ? "border-sage/70"
                    : "border-sage/60"
                  : onDark
                    ? "border-white/20"
                    : "border-line"
              }`}
            >
              <p className={`text-[14.5px] leading-[1.55] ${onDark ? "text-cream/85" : "text-ink/85"}`}>
                {hydrated
                  ? r.text
                  : t(
                      "Mainkan satu percakapan, dan baris ini berubah jadi pengamatan tentang caramu bicara.",
                      "Play one conversation and this line becomes an observation about how you speak.",
                    )}
              </p>
            </li>
          ))}
        </ul>

        {/* Insting sosial: satu kalimat dari tiga angka `reads`.
            Sengaja TIDAK ditampilkan sebagai meteran atau persentase — yang
            berguna bagi pengguna adalah kecenderungannya, bukan skornya. */}
        {hydrated && totalReads > 0 && (
          <div className={`mt-6 border-t pt-5 ${onDark ? "border-white/10" : "border-line"}`}>
            <p className={`eyebrow ${dim}`}>{t("Insting sosialmu", "Your social instinct")}</p>
            <p className={`mt-1.5 text-[14.5px] leading-[1.55] ${onDark ? "text-cream/85" : "text-ink/85"}`}>
              {readSentence}
            </p>
          </div>
        )}

        {/* ------------------------------------------------ peta kurikulum ---
            RUANG → SUMBU → PROFIL, dibuat terbaca. Enam ruangan Noera bukan
            batas konten: keenamnya adalah keenam sumbu yang membentuk potret
            ini. Tanpa blok ini, hubungan itu cuma ada di dalam kode. */}
        <div className={`mt-7 border-t pt-5 ${onDark ? "border-white/10" : "border-line"}`}>
          <p className={`eyebrow ${dim}`}>
            {t("Enam sumbu yang membentuk ini", "The six axes this is made of")}
          </p>
          <dl className="mt-3 space-y-2.5">
            {axes.map((a) => (
              <div
                key={a.axis}
                className={`flex flex-wrap items-baseline gap-x-2 border-l-2 pl-3 ${
                  a.tested
                    ? onDark
                      ? "border-sage/70"
                      : "border-sage/60"
                    : onDark
                      ? "border-white/15"
                      : "border-line"
                }`}
              >
                <dt
                  className={`text-[13.5px] font-semibold ${
                    a.tested ? strong : onDark ? "text-cream/55" : "text-mute"
                  }`}
                >
                  {tr(a.label)}
                </dt>
                <dd className={`text-[12.5px] ${dim}`}>
                  {a.room?.city}
                  {" — "}
                  <span className={a.tested ? (onDark ? "text-sage" : "text-sage") : ""}>
                    {a.tested
                      ? t("sudah diuji", "tested")
                      : t("belum kamu temui", "not met yet")}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ------------------------------------------- satu hal untuk dilatih */}
        <div className={`mt-7 border-t pt-5 ${onDark ? "border-white/10" : "border-line"}`}>
          <p className={`eyebrow ${dim}`}>
            {t("Yang perlu kamu latih berikutnya", "What to practise next")}
          </p>
          <p className={`display mt-1.5 text-[1.5rem] leading-tight ${strong}`}>
            {tr(labelFor(next.attribute))}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <HandNote color={onDark ? "#ff9d6b" : "#b04a19"}>
              {next.replay
                ? t("ruangan ini layak diulang", "worth walking into again")
                : t("ruangan yang menguji itu", "the room that tests it")}
            </HandNote>
            <HandArrow direction="right" color={onDark ? "#ff9d6b" : "#b04a19"} length={34} />
          </div>

          <Link
            href="/learn"
            className={`mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-[1.1rem] border px-4 py-2.5 transition-colors ${
              onDark
                ? "border-white/15 hover:border-white/40"
                : "border-line hover:border-ink/35"
            }`}
          >
            <span className={`display text-[1.05rem] ${strong}`}>{next.scenario.city}</span>
            <span className={`text-[12.5px] ${dim}`}>· {tr(next.scenario.tension)}</span>
          </Link>
        </div>

        {/* Tangga kematangan sengaja TIDAK diulang di sini: seksi yang
            memuat potret ini sudah menampilkannya di kolom sebelah, dan di
            layar yang sama ia jadi muncul dua kali. */}
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${
            onDark ? "border-white/10" : "border-line"
          }`}
        >
          <p className={`hand text-[17px] ${onDark ? "text-cream/55" : "text-clay"}`}>
            {t(
              "tidak ada nilai di halaman ini — cuma catatan",
              "no grade on this page — only notes",
            )}
          </p>
          <button
            onClick={reset}
            className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors ${
              onDark
                ? "border-white/20 text-cream/70 hover:text-cream"
                : "border-line text-mute hover:border-ink/40 hover:text-ink"
            }`}
          >
            {t("Atur ulang progres", "Reset progress")}
          </button>
        </div>
      </div>
    </div>
  );
}
