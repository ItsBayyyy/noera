# Noera — Kuasai bahasanya. Pahami momennya.

Karya untuk **PNBWDC IntechFest 2026 — Web Design Competition**
Tema: *Education Technology: Language Learning for Global Community*

## 🔗 Situs langsung — **<https://noera-gamma.vercel.app>**

Tidak perlu memasang apa pun. Buka tautannya, lalu klik **"Jelajahi profil
contoh"** di halaman [Masuk](https://noera-gamma.vercel.app/signin) — tanpa
kata sandi, langsung mendarat di skenarionya.

| Halaman | Tautan langsung |
| --- | --- |
| Beranda | <https://noera-gamma.vercel.app> |
| Belajar | <https://noera-gamma.vercel.app/learn> |
| Komunitas | <https://noera-gamma.vercel.app/community> |
| Masuk | <https://noera-gamma.vercel.app/signin> |
| Daftar | <https://noera-gamma.vercel.app/signup> |

Gunakan Chrome atau Edge terbaru — tahap menyimak dan berbicara memakai Web
Speech API bawaan browser.

> "Berbahasa bukan cuma soal tahu katanya. Ini soal tahu kata yang tepat untuk
> orang, konteks, budaya, dan momen yang tepat."

Noera adalah **simulasi sosial** berilustrasi untuk pembelajar bahasa. Kamu
tidak menerjemahkan kalimat — kamu masuk ke sebuah ruangan, seseorang bicara
padamu, lalu kamu memilih apa yang benar-benar akan kamu ucapkan. Setelah itu
kamu melihat apa yang kalimat itu lakukan pada orang di depanmu.

---

## Mekanik intinya: Konsekuensi Sosial

Setiap pilihan mengembalikan tiga bacaan, bukan "benar / salah". Ini angka
sungguhan dari percakapan di beranda, dan kedua pilihannya sama-sama benar
secara tata bahasa:

| | Ketepatan bahasa | Kecocokan budaya | Hubungan |
| --- | --- | --- | --- |
| *"Of course — I'll have it to you by tonight."* | 97% | 94% | +5 |
| *"Yeah, sure, whenever I get to it."* | 98% | 31% | −9 |

Ketepatan bahasanya nyaris sama; hasilnya sama sekali tidak. Jarak itulah
seluruh produk ini. Ketepatan bahasa sengaja ditulis dengan warna tinta netral
sementara dua kolom lain berwarna — karena bukan angka itu yang menentukan
hasilnya.

Wajah lawan bicara berubah **sebelum** angkanya muncul: reaksinya seketika,
bacaannya menyusul pada 550 ms di beranda dan 700 ms di dalam skenario penuh,
lalu penjelasannya pada 1700 ms. Dirasakan dulu, dibaca kemudian. Kalimat yang
sempurna tata bahasanya tetap bisa merusak sebuah hubungan, dan pembelajar
diberi tahu persis kenapa dalam satu kalimat, ditambah catatan budaya.

Progresinya memakai **Reputasi Sosial**, bukan XP: enam atribut komunikasi
(Respect, Empathy, Adaptability, Context, Confidence, Cultural Awareness) yang
bergerak hanya karena ada orang di dalam skenario yang bereaksi terhadap
ucapanmu. Tingkatannya: Newcomer → Observer → Adapter → Connector → Global
Citizen. Tiap tingkat membuka *jenis* ruangan yang berbeda, bukan lencana —
Connector membuka skenario perbaikan, percakapan yang sudah rusak sejak awal.

**Tantangan Global** adalah mekanik komunitasnya: satu situasi setiap minggu,
semua pembelajar, tiga detik yang sama. Tetapkan jawabanmu dan sebarannya
terbuka — total lebih dulu, lalu per wilayah, masing-masing dengan seorang
pembelajar yang menjelaskan kenapa jawabannya terasa sudah jelas. Data
wilayahnya selalu disampaikan sebagai kecenderungan orang-orang yang menjawab,
tidak pernah sebagai klaim tentang siapa pun.

**Ruang Harian** adalah alasan untuk kembali: satu situasi sosial baru tiap
hari, lalu hitung mundur menuju ruang besok. Tidak ada rentetan hari yang harus
dijaga, tidak ada yang hilang kalau kamu melewatkan sehari.

## Satu percakapan, enam tahap

Setiap ruangan menjalankan putaran yang sama, dan penanda tahap menyebutkan di
mana posisimu:

**Baca** → **Dengar** → **Pilih** → **Akibat** → **Kenapa** → **Ucapkan**

Masing-masing dari enam skenario melatih empat keterampilan, yang ditulis per
skenario di `lib/kairos/scenarios.ts`:

| Keterampilan | Tempatnya |
| --- | --- |
| Membaca | "Baca ruangannya" — sebuah pesan masuk; jawab apa yang *sebenarnya* diminta, bukan apa yang tertulis |
| Menyimak | "Dengar cara dia bicara" — `speechSynthesis` membacakan kalimatnya |
| Berbicara | Ucapkan kalimatnya lewat mikrofon — `SpeechRecognition` |
| Budaya | Catatan budaya setelah setiap konsekuensi |

Pilihan jawaban sengaja disembunyikan sampai kamu mengunci tebakan tentang
reaksinya. Kalau keduanya muncul bersamaan, latihannya berubah jadi "tebak
jawabannya", bukan "baca ruangannya".

## Halaman

| Rute | Isinya |
| --- | --- |
| `/` | Beranda — percakapan di hero, celahnya, mekanik konsekuensi, komik interaktif, komunitas, peta perjalanan, reputasi, ajakan |
| `/learn` | Simulasinya: 6 skenario di Tokyo, Berlin, New York, Seoul, Jakarta, Paris |
| `/community` | Tantangan Global mingguan, jajak pendapat antarwilayah, catatan lapangan |
| `/signin`, `/signup` | Sengaja dibuat tenang — produknya dimulai di sisi seberang |

Diuji responsif pada **393×852**, **820×1180**, dan **1440×1024**: tidak ada
pengguliran horizontal dan tidak ada galat konsol di kelima halaman pada ketiga
ukuran. Di bawah 1024 px navigasi utama pindah ke bilah bawah supaya terjangkau
jempol; bilah atas hanya menyisakan logo dan pemilih bahasa.

## Bahasa

Antarmukanya memakai **Bahasa Indonesia secara bawaan**, dengan tombol ID/EN di
bilah navigasi dan di footer. Pilihannya tersimpan di browser.

Yang sengaja tetap berbahasa Inggris: kalimat yang diucapkan karakter, tiga
pilihan jawaban, dan isi pesan yang dibaca pada tahap "Baca ruangannya". Itu
materi yang sedang dilatih — menerjemahkannya sama saja menghapus pelajarannya.
Semua penjelasan, catatan budaya, dan teks antarmuka diterjemahkan penuh.

## Untuk juri: masuk sekali klik

Di **/signin** (dan **/signup**) ada tombol **"Jelajahi profil contoh"** — tanpa
kata sandi, tanpa formulir. Tombol itu memuat profil yang sudah berjalan (dua
percakapan sudah dijalani, dua hubungan sudah punya riwayat, reputasi sosial di
tingkat Adapter) dan mendarat langsung di skenarionya, bukan di puncak halaman.
Ruang Harian dan Tantangan Global sengaja dibiarkan kosong supaya kedua momen
pembukaannya tetap terjadi di depan matamu. Formulir email/kata sandi biasa
tetap utuh, persis di bawahnya.

## Aksesibilitas

- Setiap elemen interaktif punya cincin fokus papan ketik yang terlihat (2 px
  warna ember, jarak 3 px) dan muncul seketika — cincinnya dikecualikan dari
  transisi warna, jadi tidak pernah mengambang dulu dengan warna teksnya.
- Tiga bacaan konsekuensi berada di dalam wilayah `aria-live="polite"`, jadi
  bagian yang benar-benar berubah ikut diumumkan; sisa halamannya tidak.
- `prefers-reduced-motion` dihormati di seluruh produk, termasuk tempo
  pengungkapan: pengguna yang meminta gerak minimal mendapat reaksi dan
  angkanya sekaligus, karena jedanya memang alat pengatur tempo — dan tempo itu
  yang mereka tolak.
- Satu `<h1>` per halaman, label terhubung ke setiap input, sasaran sentuh
  minimal 44 px.

## Cara menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run start    # menyajikan hasil build produksi
```

Gunakan Chrome atau Edge terbaru. Menyimak dan berbicara memakai Web Speech API
bawaan browser; kalau mikrofonnya ditolak atau tidak didukung, tahap berbicara
berubah jadi latihan baca nyaring dan tidak ada yang rusak.

Jangan menjalankan `npm run dev` dan `npm run build` bersamaan — keduanya
menulis ke `.next/`, dan `tsconfig.json` ikut membaca tipe yang dihasilkan mode
pengembangan, sehingga build yang berjalan bersamaan bisa membaca berkas yang
baru ditulis separuh lalu gagal.

Tanpa backend, tanpa kunci API, tanpa basis data. Progresnya (atribut, skenario
yang selesai, hubungan) disimpan di `localStorage` dengan kunci
`kairos.progress.v2` dan bisa dihapus lewat panel Reputasi Sosial.

## Struktur

```
app/                     rute: page.tsx, learn, community, signin, signup
  globals.css            token desain, cincin fokus, tekstur kertas, animasi
components/kairos/
  Character.tsx          aktor gambar tangan parametrik: 10 ekspresi,
                         berkedip / bernapas / bicara, digerakkan reaksi
  HeroExchange.tsx       versi 10 detik dari produk ini, di beranda
  ScenarioPlayer.tsx     baca → dengar → pilih → akibat → kenapa → ucapkan
  LearningSpine.tsx      penanda enam tahap, versi penjelasan dan versi ringkas
  ReadTheRoom.tsx        kunci tebakan dulu sebelum pilihan jawaban muncul
  ScenarioBrief.tsx      pesan yang membawamu masuk ke ruangan itu
  Listen.tsx             speechSynthesis, dengan cadangan yang diam
  SpeakPractice.tsx      SpeechRecognition, dengan jalur saat izin ditolak
  RetryCompare.tsx       ucapkan dengan cara lain, lalu bandingkan keduanya
  DeliveryReflection.tsx sebutkan sendiri bagaimana kamu menyampaikannya
  CulturalBasis.tsx      kenapa ruangan itu membacanya seperti itu
  ConsequenceComic.tsx   pilihan → reaksi → akibat → adegan berikutnya
  GlobalChallenge.tsx    satu situasi, semua pembelajar, jawab dulu baru terbuka
  PerspectivePoll.tsx    perspektif antarwilayah, jawab dulu baru terbuka
  DailyRoom.tsx          situasi hari ini + hitung mundur ke ruang besok
  WorldMap.tsx           perjalanannya: enam sistem sosial dalam satu rute
  SocialPortrait.tsx     profil komunikasi, ditulis sebagai kalimat bukan bar
  TierUp.tsx             momen sebuah tingkat terbuka, dan apa yang dibukanya
  Onboarding.tsx         tur lima langkah yang menunjuk elemen aslinya
  RouteTransition.tsx    transisi halaman berupa tirai kertas
  BottomBar.tsx          navigasi jangkauan jempol di bawah 1024 px
  Ink.tsx                lapisan tinta: catatan, panah, lingkaran penekanan,
                         dan tanda reaksi di sekeliling karakter
  Meters.tsx, Flag.tsx, ui.tsx, SiteShell.tsx, AuthShell.tsx
components/motion/       primitif animasi
lib/kairos/              skenario, jajak pendapat, tujuan, tipe, i18n,
                         penyimpanan localStorage
scripts/                 package-submission.mjs — membungkus ZIP pengumpulan
```

`kairos` adalah nama ruang modul internal sekaligus kunci penyimpanan, sengaja
dipertahankan supaya progres yang sudah tersimpan tidak hilang; produknya
bernama Noera di seluruh antarmuka.

Teknologi: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer
Motion. `npx tsc --noEmit` bersih dan `npm run build` memprarender keenam rute
tanpa peringatan. Bendera, karakter, ikon, dan seluruh ilustrasi dibuat sendiri
sebagai SVG; satu-satunya berkas raster di repositori ini adalah
`app/favicon.ico`. Tidak ada foto dan tidak ada ketergantungan gambar.

## Catatan desain

Latar krem hangat (`#fbf8f3`), jeda seksi espresso pekat, aksen ember, kartu
bersudut bulat, label pil, ruang kosong yang lega, tepi seksi yang organik, dan
wordmark raksasa yang berjalan.

Kira-kira 80% antarmuka editorial yang bersih, 20% bahasa interaksi gambar
tangan: Caveat hanya dipakai untuk catatan pinggir, arahan panggung, dan label
reaksi — tidak pernah untuk teks antarmuka atau teks isi. Fraunces membawa
huruf judul.

Palet konsekuensinya tertahan dan bermakna, bukan dekoratif — sage berarti
kalimatnya mendarat, clay berarti selamat, rose berarti ada harganya — dan
setiap animasi terikat pada satu sinyal sosial, jadi tidak ada gerak yang ada
untuk dirinya sendiri. Bendera digambar sebagai SVG karena emoji bendera tidak
tampil di browser Windows.

Pemisah antar kartu digambar sebagai garis tepi kartu, bukan celah 1 px yang
membiarkan latar tembus: tiga kolom dari lebar 1320 px menghasilkan angka
pecahan, dan celah pecahan bisa jatuh di antara dua piksel layar lalu hilang
sama sekali pada satu pemisah tapi tidak pada yang lain.
