"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { HandNote } from "./Ink";
import { useT } from "@/lib/kairos/i18n";
import type { Verdict } from "@/lib/kairos/types";

/* --------------------------------------------------------------------------
   UCAPKAN → REFLEKSI PENYAMPAIAN

   Panduan lomba menyebut speaking secara eksplisit. Kairos sudah punya
   perekaman suara (SpeakPractice), tapi sampai sekarang cara menyampaikan
   tidak pernah ikut menentukan apa pun — pengguna hanya dinilai dari kalimat
   mana yang dipilih.

   Yang TIDAK dilakukan di sini, dan sengaja:
   - tidak ada penilaian pelafalan
   - tidak ada angka kepercayaan diri buatan
   - tidak ada klaim bahwa mesin mendengar nada bicara

   Menilai nada suara secara jujur butuh model akustik yang tidak ada di
   browser. Jadi yang dipakai adalah refleksi: pengguna sendiri yang menyebut
   bagaimana ia menyampaikannya, lalu Kairos menjelaskan apa arti pilihan itu
   di dalam hubungan yang sedang berjalan. Itu tetap latihan berbicara, dan
   tetap jujur.
   -------------------------------------------------------------------------- */

type Delivery = "hangat" | "netral" | "tegas";

const OPTIONS: { id: Delivery; id_label: string; en_label: string }[] = [
  { id: "hangat", id_label: "Hangat", en_label: "Warm" },
  { id: "netral", id_label: "Netral", en_label: "Neutral" },
  { id: "tegas", id_label: "Tegas", en_label: "Firm" },
];

/**
 * Arti penyampaian selalu bergantung pada dua hal: seberapa pas kalimatnya
 * tadi, dan seberapa dekat hubungannya. Jadi tidak ada satu jawaban "benar" —
 * yang sama bisa menolong di satu ruangan dan merugikan di ruangan lain.
 */
function readingFor(delivery: Delivery, verdict: Verdict, npcRole: string) {
  const R: Record<Delivery, Record<Verdict, { id: string; en: string }>> = {
    hangat: {
      ideal: {
        id: `Kalimatmu sudah pas, dan kamu menyampaikannya dengan hangat. Di hubungan seperti ini — ${npcRole} — itu yang membuat orang merasa aman meminta tolong lagi nanti.`,
        en: `The sentence was right, and you delivered it warmly. In a relationship like this one — ${npcRole} — that is what makes someone comfortable asking you again later.`,
      },
      workable: {
        id: `Kalimatnya masih bisa dibaca dua arah, tapi kehangatan penyampaianmu menutup sebagian jaraknya. Nada bisa memperbaiki kalimat yang setengah pas — tidak selalu, tapi sering.`,
        en: `The sentence could still be read two ways, but your warmth closed part of the gap. Tone can rescue a half-right sentence — not always, but often.`,
      },
      costly: {
        id: `Hangat tidak menghapus isi. Kalimatnya sendiri yang bermasalah di ruangan ini, dan nada ramah justru bisa membuat orang bingung — ramah tapi menolak.`,
        en: `Warmth does not erase content. The sentence itself was the problem here, and a friendly tone can even confuse — kind, but still refusing.`,
      },
    },
    netral: {
      ideal: {
        id: `Kalimat yang pas, disampaikan datar. Aman, dan di banyak ruangan profesional memang ini yang diharapkan. Tapi tidak ada yang menempel di ingatan orang.`,
        en: `The right sentence, delivered flat. Safe, and in many professional rooms exactly what is expected. But nothing stays with the other person.`,
      },
      workable: {
        id: `Kalimat setengah pas dengan nada datar cenderung dibaca seadanya — orang mengisi sendiri kekosongannya, dan biasanya tidak dengan tafsiran yang menguntungkanmu.`,
        en: `A half-right sentence in a flat tone gets read literally — the other person fills the gap themselves, usually not in your favour.`,
      },
      costly: {
        id: `Nada datar membuat kalimat yang sudah terlalu langsung terdengar makin dingin. Tidak ada yang melunakkan.`,
        en: `A flat delivery makes an already-too-direct sentence land colder. Nothing softens it.`,
      },
    },
    tegas: {
      ideal: {
        id: `Isi dan keyakinan sejalan. Di ruangan ini ketegasan terbaca sebagai kejelasan — kamu tidak memperkecil maksudmu sendiri.`,
        en: `Content and conviction matched. Here firmness reads as clarity — you did not shrink your own meaning.`,
      },
      workable: {
        id: `Tegas mempertajam apa pun yang kamu ucapkan, termasuk bagian yang belum pas. Kalau ragu isinya, biasanya lebih aman menurunkan tekanan dulu.`,
        en: `Firmness sharpens whatever you said, including the part that was not quite right. When unsure of the content, easing the pressure is usually safer.`,
      },
      costly: {
        id: `Kalimatnya sudah terlalu langsung, lalu disampaikan dengan tegas. Buat ${npcRole}, dua-duanya menumpuk jadi satu kesan: kamu tidak menganggap posisinya penting.`,
        en: `The sentence was already too direct, then delivered firmly. To ${npcRole}, the two stack into one impression: you did not think their standing mattered.`,
      },
    },
  };
  return R[delivery][verdict];
}

export function DeliveryReflection({
  verdict,
  npcRole,
  onDone,
}: {
  verdict: Verdict;
  npcRole: string;
  onDone?: () => void;
}) {
  const t = useT();
  const [picked, setPicked] = useState<Delivery | null>(null);

  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="eyebrow text-mute">
        {t("Bagaimana kamu menyampaikannya?", "How did you deliver it?")}
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-mute">
        {t(
          "Kamu sendiri yang menilai ini — Noera tidak mendengar nada suaramu.",
          "You judge this one yourself — Noera does not listen to your tone of voice.",
        )}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const on = picked === o.id;
          return (
            <button
              key={o.id}
              onClick={() => {
                setPicked(o.id);
                onDone?.();
              }}
              aria-pressed={on}
              className={`inline-flex min-h-[44px] items-center rounded-[1.1rem] border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                on
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-white text-ink hover:border-ink/40"
              }`}
            >
              {t(o.id_label, o.en_label)}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 border-l-2 border-clay/40 pl-4"
          >
            <p className="text-[14px] leading-[1.6] text-ink/85">
              {t(
                readingFor(picked, verdict, npcRole).id,
                readingFor(picked, verdict, npcRole).en,
              )}
            </p>
            <HandNote className="mt-1.5" color="#b04a19">
              {t(
                "kalimat yang sama, dua penyampaian, dua kesan",
                "same sentence, two deliveries, two impressions",
              )}
            </HandNote>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
