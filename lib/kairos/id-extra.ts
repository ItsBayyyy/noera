/* --------------------------------------------------------------------------
   Sisa teks yang muncul di layar: label gaya bicara di bawah tiap pilihan,
   peran karakter, pilihan jawaban pemahaman bacaan, dan suara-suara komunitas.
   -------------------------------------------------------------------------- */

export const ID_EXTRA: Record<string, string> = {
  /* ------------------------------------------------ label gaya bicara --- */
  "Warm · deferential · specific": "Hangat · sungkan · spesifik",
  "Over-formal · ceremonial": "Terlalu formal · seremonial",
  "Casual · vague": "Santai · mengambang",
  "Honest · already acting": "Jujur · sudah ditindaklanjuti",
  "Closed · reassuring": "Menutup · menenangkan",
  "Direct · blames the design": "Lugas · menyalahkan sistemnya",
  "Names what he did": "Menyebut apa yang dia lakukan",
  "Competent · transactional": "Kompeten · transaksional",
  "Minimal · unmarked exit": "Seadanya · pergi tanpa penutup",
  "Direct · specific · constructive": "Lugas · spesifik · membangun",
  "Cushioned · non-committal": "Dibungkus · tanpa keputusan",
  "Blunt · no reasoning": "Blak-blakan · tanpa alasan",
  "Concrete alternative": "Usulan konkret",
  "Defers to rank": "Melempar ke atasan",
  "Opinion without proposal": "Pendapat tanpa usulan",
  "Playful · returns the serve": "Cair · mengembalikan bolanya",
  "Literal · informational": "Harfiah · informatif",
  "Minimal · closed": "Seadanya · menutup",
  "Warm · gives a hook": "Hangat · memberi pancingan",
  "Org chart · formal": "Struktur organisasi · formal",
  Shrinking: "Mengecilkan diri",
  "Reciprocal · seniority-aware": "Timbal balik · paham senioritas",
  "Friendly · gesture mismatch": "Ramah · gesturnya meleset",
  "Honest · unsoftened": "Jujur · tanpa pelembut",
  "Warm · credits a junior": "Hangat · mengangkat nama junior",
  "Candid · wrong venue": "Terbuka · salah tempat",
  Closed: "Menutup",
  "Soft decline · relationship-first": "Menolak halus · hubungan dulu",
  "Clear · flat": "Jelas · datar",
  "Agreeable · unreliable": "Mengiyakan · tidak bisa dipegang",
  "Specific · reciprocal": "Spesifik · timbal balik",
  "Deferred · reads as no": "Ditunda · terbaca sebagai penolakan",
  "Deferential · unhelpful": "Sungkan · tidak membantu",
  "Engaged · counter-argument": "Terlibat · membalas argumen",
  "Deferential · closed": "Sungkan · menutup",
  "Attacks the speaker": "Menyerang orangnya",
  "Escalates the idea": "Menaikkan mutu argumennya",
  Unsupported: "Tanpa dasar",
  "Turns on the person": "Berbalik ke orangnya",

  /* -------------------------------------------------- peran karakter --- */
  "Faculty supervisor · met 2 minutes ago": "Dosen pembimbing · baru kenal 2 menit",
  "Design lead · works with you daily": "Design lead · kerja bareng tiap hari",
  "VP of Partnerships · stranger": "VP Partnerships · belum saling kenal",
  "Team manager · 15 years your senior": "Manajer tim · 15 tahun lebih senior",
  "Neighbour · sees you every day": "Tetangga · ketemu tiap hari",
  "Host · enjoys an argument": "Tuan rumah · senang berdebat",

  /* ------------------------------- pilihan jawaban pemahaman bacaan --- */
  "A formal review of my report.": "Peninjauan resmi atas laporan saya.",
  "A first introduction, with the report as the excuse.":
    "Perkenalan pertama, dengan laporan sebagai alasannya.",
  "A warning about my performance.": "Peringatan soal performa saya.",
  "Reassure her that both versions are fine.":
    "Menenangkan dia bahwa kedua versinya sudah oke.",
  "Skip the softening and give a verdict she can act on.":
    "Lewati basa-basinya dan beri keputusan yang bisa langsung dia pakai.",
  "Be careful — she sounds irritated with me.":
    "Hati-hati — sepertinya dia sedang kesal padaku.",
  "That she is senior, so I should be formal with her.":
    "Bahwa dia senior, jadi aku harus formal dengannya.",
  "That a throwaway conversation is doing real work.":
    "Bahwa obrolan sepele itu sebenarnya sedang bekerja.",
  "That I should pitch my project if I meet her.":
    "Bahwa aku sebaiknya menawarkan proyekku kalau bertemu dia.",
  "The rules of drinking at a Korean work dinner.":
    "Aturan minum di acara makan malam kantor Korea.",
  "That tonight, gestures will carry more meaning than sentences.":
    "Bahwa malam ini, gestur lebih banyak bicara daripada kalimat.",
  "That Mr. Han is difficult to get along with.":
    "Bahwa Pak Han sulit diajak akur.",
  "Whether I am free on Sunday.": "Apakah aku senggang hari Minggu.",
  "Whether the relationship is still open.":
    "Apakah hubungan kami masih terbuka.",
  "Whether I will bring something to the gathering.":
    "Apakah aku akan membawa sesuatu ke acaranya.",
  "A relaxed dinner where I should avoid controversy.":
    "Makan malam santai yang sebaiknya bebas perdebatan.",
  "One where disagreeing with him is how you are welcomed.":
    "Malam di mana membantah dia justru cara dia menyambutmu.",
  "A test to see whether I know enough to belong.":
    "Ujian untuk melihat apakah pengetahuanku cukup untuk diterima.",

  /* --------------------------------------------------- suara komunitas --- */
  Indonesia: "Indonesia",
  Japan: "Jepang",
  Germany: "Jerman",
  "United States": "Amerika Serikat",
  "South Korea": "Korea Selatan",
  France: "Prancis",
  Brazil: "Brasil",
  "Your professor asks you to stay after class.":
    "Dosenmu memintamu tinggal sebentar setelah kelas.",
  "You have no idea why. What is your first sentence?":
    "Kamu tidak tahu kenapa. Apa kalimat pertamamu?",
  "Your host offers you a third serving. You are full.":
    "Tuan rumah menawarkan porsi ketiga. Kamu sudah kenyang.",
  "How do you decline?": "Bagaimana kamu menolaknya?",
  "Asking “is everything alright” shows care first. Going straight to the reason can feel like you're demanding something from a teacher.":
    "Menanyakan “semuanya baik-baik saja?” menaruh perhatian di depan. Langsung menanyakan alasannya bisa terasa seperti menuntut sesuatu dari guru.",
  "I'd wait. He'll explain when he decides to — asking why puts pressure on him to justify himself first.":
    "Aku akan menunggu. Dia akan menjelaskan saat dia memutuskan begitu — bertanya duluan malah menekannya untuk membenarkan diri.",
  "Asking what it's about doesn't feel rude to me, it feels efficient. Most of my professors seemed to appreciate it.":
    "Menanyakan ini soal apa tidak terasa kasar buatku, malah efisien. Kebanyakan dosenku kelihatannya menghargai itu.",
  "Direct question, direct answer. Softening it would just make the conversation longer than it needs to be.":
    "Pertanyaan lugas, jawaban lugas. Memperhalusnya cuma bikin percakapannya lebih panjang dari yang perlu.",
  "Saying no clearly feels respectful to me. Pretending I might eat later just leaves the host guessing.":
    "Menolak dengan jelas terasa sopan buatku. Pura-pura mungkin makan nanti cuma bikin tuan rumah menebak-nebak.",
  "I try not to close the door completely. “Maybe later” lets the host keep offering without either of us losing face.":
    "Aku berusaha tidak menutup pintunya rapat-rapat. “Nanti ya” membuat tuan rumah tetap bisa menawarkan tanpa ada yang kehilangan muka.",
  "Leaving a little on the plate says “you gave me more than enough”. Emptying it can suggest I could have eaten more.":
    "Menyisakan sedikit di piring berarti “kamu memberi lebih dari cukup”. Menghabiskannya bisa berarti aku sebenarnya masih sanggup makan lagi.",
  "A clear no with a compliment attached. The hosts I know would rather I be comfortable than polite.":
    "Menolak jelas sambil menyelipkan pujian. Tuan rumah yang kukenal lebih ingin aku nyaman daripada sopan.",

  /* ------------------------------------------------- catatan lapangan --- */
  "My “thank you” sounded sarcastic and I still don't know why":
    "“Terima kasih”-ku terdengar sinis dan aku masih tidak paham kenapa",
  "In Berlin my feedback was “too nice to be useful”":
    "Di Berlin, masukanku disebut “terlalu manis untuk berguna”",
  "Small talk isn't fake — it's a door. Took me a year.":
    "Basa-basi itu bukan pura-pura — itu pintu. Aku butuh setahun untuk paham.",
  "I used the most polite form I knew with a classmate my own age. He laughed and said it felt like I was joking. Turns out extra formality between peers can read as distance — or mockery.":
    "Aku memakai bentuk paling sopan yang kutahu ke teman sekelas seumuran. Dia tertawa dan bilang rasanya aku sedang bercanda. Ternyata formalitas berlebih antar teman sebaya bisa terbaca sebagai jarak — atau ejekan.",
  "I spent two sentences complimenting before the real point. My lead thought I had no opinion. I've started leading with the verdict and putting the warmth after.":
    "Aku menghabiskan dua kalimat untuk memuji sebelum masuk ke inti. Lead-ku mengira aku tidak punya pendapat. Sekarang aku mulai dengan kesimpulannya dulu, kehangatannya belakangan.",
  "I used to answer weather questions with facts. Nobody was asking about weather. Once I started volleying back, people started introducing themselves.":
    "Dulu aku menjawab pertanyaan soal cuaca dengan data. Tidak ada yang benar-benar menanyakan cuaca. Begitu aku mulai membalas obrolannya, orang-orang mulai memperkenalkan diri.",
  "Tokyo · Receiving help": "Tokyo · Menerima bantuan",
  "Berlin · Studio critique": "Berlin · Kritik di studio",
  "New York · Elevator": "New York · Di dalam lift",
  "softening a refusal": "memperhalus penolakan",
  "reading silence": "membaca keheningan",
  "disagreeing early": "menyanggah lebih awal",
  "seniority at dinner": "senioritas di meja makan",
  "the first thirty seconds": "tiga puluh detik pertama",
  "arguing as attention": "berdebat sebagai bentuk perhatian",
};
