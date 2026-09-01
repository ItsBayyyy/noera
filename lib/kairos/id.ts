"use client";

import { useCallback } from "react";
import { useLang } from "./i18n";
import { ID_SCENARIOS } from "./id-scenarios";
import { ID_EXTRA } from "./id-extra";

/* --------------------------------------------------------------------------
   Terjemahan untuk teks yang tersimpan di data (skenario, atribut, tingkat,
   penjelasan budaya). Kuncinya adalah kalimat Inggrisnya sendiri, jadi tidak
   ada nama kunci yang perlu dijaga dan terjemahan selalu bisa dilacak ke
   sumbernya.

   Yang sengaja TIDAK diterjemahkan: kalimat yang diucapkan karakter, tiga
   pilihan jawaban, dan isi pesan yang dibaca. Itu materi bahasa yang sedang
   dipelajari — menerjemahkannya sama saja menghapus pelajarannya.
   -------------------------------------------------------------------------- */

const UI: Record<string, string> = {
  /* ---------------------------------------------------------- atribut --- */
  Respect: "Rasa hormat",
  Empathy: "Empati",
  Adaptability: "Keluwesan",
  Context: "Konteks",
  Confidence: "Percaya diri",
  "Cultural Awareness": "Kepekaan budaya",
  "Reading hierarchy and distance": "Membaca hierarki dan jarak",
  "Hearing what is not said": "Mendengar yang tidak diucapkan",
  "Switching register mid-conversation": "Berganti gaya bicara di tengah obrolan",
  "Matching words to the moment": "Menyesuaikan kata dengan momennya",
  "Speaking without shrinking": "Bicara tanpa mengecilkan diri",
  "Noticing the unwritten rules": "Menangkap aturan yang tak tertulis",

  /* --------------------------------------------------------- tingkatan --- */
  "You know words. The room is still a blur.":
    "Kosakatamu ada. Ruangannya masih buram.",
  "You notice tone before you answer.": "Kamu menangkap nada sebelum menjawab.",
  "You change register on purpose, not by accident.":
    "Kamu mengganti gaya bicara dengan sadar, bukan kebetulan.",
  "People feel understood by you, and say so to others.":
    "Orang merasa dimengerti olehmu, dan menceritakannya ke orang lain.",
  "You are fluent in the moment, not only the language.":
    "Kamu fasih membaca momen, bukan cuma bahasanya.",
  "Clear, low-stakes situations with one social variable at a time.":
    "Situasi ringan dan jelas, satu variabel sosial dalam satu waktu.",
  "Conversations that keep going after your first sentence.":
    "Percakapan yang terus berlanjut setelah kalimat pertamamu.",
  "Rooms where two people expect opposite things from you.":
    "Ruangan di mana dua orang mengharapkan hal yang berlawanan darimu.",
  "Repair scenarios — conversations that begin already damaged.":
    "Skenario perbaikan — percakapan yang dimulai dalam keadaan sudah rusak.",
  "Ambiguous rooms with no good option, only better trade-offs.":
    "Ruangan abu-abu tanpa pilihan yang benar-benar baik, hanya pertukaran yang lebih masuk akal.",

  /* ------------------------------------------------------------ dunia --- */
  "Hierarchy & indirectness": "Hierarki & bahasa tak langsung",
  "Direct communication": "Komunikasi lugas",
  "Small talk & first contact": "Basa-basi & perkenalan pertama",
  "Seniority & the group": "Senioritas & kelompok",
  "Politeness & familiarity": "Kesopanan & kedekatan",
  "Social nuance & debate": "Nuansa sosial & debat",
  "Directness without coldness": "Lugas tanpa jadi dingin",
  "Small talk & warm distance": "Basa-basi & kehangatan berjarak",
  "Rooms where the request arrives already softened — and matching that softness is the answer.":
    "Ruangan di mana permintaan datang sudah dilembutkan — dan menyamai kelembutan itulah jawabannya.",
  "Rooms where clear disagreement, with a reason attached, is the respectful move.":
    "Ruangan di mana menolak dengan jelas, lengkap dengan alasannya, justru bentuk penghormatan.",
  "Rooms where the first thirty seconds decide whether there is a second conversation.":
    "Ruangan di mana tiga puluh detik pertama menentukan ada tidaknya percakapan kedua.",
  "Rooms where age, order and gesture rearrange a sentence before you speak it.":
    "Ruangan di mana usia, urutan, dan gestur menyusun ulang kalimatmu sebelum sempat diucapkan.",
  "Rooms where the relationship is renegotiated daily, and “maybe” can be a complete answer.":
    "Ruangan di mana hubungan dirundingkan setiap hari, dan “nanti ya” bisa jadi jawaban yang utuh.",
  "Rooms where pushing back is a form of attention, and the only forbidden move is going personal.":
    "Ruangan di mana membantah adalah bentuk perhatian, dan satu-satunya yang terlarang adalah menyerang pribadi.",
  "Meeting your professor": "Menemui dosenmu",
  "Giving critical feedback": "Memberi masukan yang tajam",
  "Meeting someone new": "Berkenalan dengan orang baru",
  "Declining an invitation": "Menolak ajakan",
  "Asking for help": "Meminta tolong",
  "Asking for help — and being asked": "Meminta tolong — dan dimintai tolong",
  "Joining a conversation": "Masuk ke obrolan yang sudah jalan",

  /* --------------------------------------------------- latar skenario --- */
  "First week of your exchange programme. You have never spoken to him before.":
    "Minggu pertama program pertukaranmu. Kamu belum pernah bicara dengannya.",
  "Your design lead hands you a draft and waits. She is direct by default.":
    "Design lead-mu menyodorkan draf lalu menunggu. Dia memang lugas dari sananya.",
  "Floor 2 to floor 21. A senior colleague you have never met steps in beside you.":
    "Lantai 2 ke lantai 21. Seorang senior yang belum pernah kamu temui masuk di sebelahmu.",
  "Team dinner. Your manager is older, and has just picked up the bottle.":
    "Makan malam tim. Manajermu jauh lebih senior, dan baru saja mengangkat botolnya.",
  "Your neighbour catches you at the gate. You already have plans on Sunday.":
    "Tetanggamu mencegatmu di depan pagar. Minggu ini kamu sudah ada acara.",
  "A dinner debate already in progress. Your host has just made a claim you think is wrong.":
    "Debat makan malam yang sudah berjalan. Tuan rumah baru saja melontarkan klaim yang menurutmu keliru.",

  /* ------------------------------------------- ruang harian & tantangan --- */
  "Your friend cancels your plans. For the third time.":
    "Temanmu membatalkan janji. Untuk ketiga kalinya.",
  "The message arrives forty minutes before you were supposed to meet.":
    "Pesannya masuk empat puluh menit sebelum kalian seharusnya bertemu.",
  "Your manager praises your work — in front of the entire team.":
    "Manajermu memuji kerjamu — di depan seluruh tim.",
  "Eleven people look up. You have about three seconds.":
    "Sebelas orang menoleh. Kamu punya sekitar tiga detik.",
  "Close friend · four years": "Teman dekat · empat tahun",
  "Your manager · in front of everyone": "Manajermu · di depan semua orang",
  "Accepts it directly": "Menerimanya langsung",
  "Redirects to the group": "Mengalihkan ke tim",
  "Deflects the praise": "Menepis pujiannya",
  "Names it · leaves room": "Menyebutkannya · memberi ruang",
  "Frictionless · costs you": "Tanpa gesekan · kamu yang menanggung",
  "Punishes · closes the door": "Menghukum · menutup pintu",
  "Protects the moment your manager is building, and your own standing inside it.":
    "Menjaga momen yang sedang dibangun manajermu, sekaligus posisimu di dalamnya.",
  "Protects the people sitting beside you, at some cost to your own visibility.":
    "Menjaga orang-orang di sebelahmu, dengan sedikit mengorbankan sorotan untukmu.",
  "Protects you from standing out, and quietly discounts the thing being praised.":
    "Menjagamu dari sorotan, sekaligus diam-diam mengecilkan hal yang sedang dipuji.",
  "Learners here most often redirected the praise to the group.":
    "Pelajar di sini paling sering mengalihkan pujian ke kelompok.",
  "Redirecting was the most common answer, with deflecting close behind.":
    "Mengalihkan jadi jawaban terbanyak, disusul menepis pujian.",
  "Accepting the credit plainly was the most common answer here.":
    "Menerima pujian apa adanya jadi jawaban terbanyak di sini.",
  "Many accepted first, then named a teammate straight afterwards.":
    "Banyak yang menerima dulu, lalu langsung menyebut nama rekan setimnya.",
  "Responses were split almost evenly between accepting and redirecting.":
    "Jawabannya terbelah hampir rata antara menerima dan mengalihkan.",
};

export const ID: Record<string, string> = { ...UI, ...ID_SCENARIOS, ...ID_EXTRA };

/**
 * tr("English source") → bahasa Indonesia bila tersedia.
 * Kalau belum ada terjemahannya, kalimat aslinya tetap tampil — tidak pernah
 * kosong, tidak pernah rusak.
 */
export function useTr() {
  const { lang } = useLang();
  return useCallback(
    (text?: string) => {
      if (!text) return text ?? "";
      if (lang !== "id") return text;
      return ID[text] ?? text;
    },
    [lang],
  );
}
