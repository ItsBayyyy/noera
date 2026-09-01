"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { AuthField, AuthShell, DemoLogin } from "@/components/kairos/AuthShell";
import { useProgress } from "@/lib/kairos/state";
import { Flag } from "@/components/kairos/Flag";
import { HandNote } from "@/components/kairos/Ink";
import { SCENARIOS } from "@/lib/kairos/data";
import { useT } from "@/lib/kairos/i18n";
import { useTr } from "@/lib/kairos/id";

/* The starting choice is not a country — it is the first room you walk into. */
const FIRST_CHALLENGES = SCENARIOS.slice(0, 4);

export default function SignUpPage() {
  const router = useRouter();
  const { signIn, setStartScenario } = useProgress();
  const t = useT();
  const tr = useTr();
  const [challenge, setChallenge] = useState(FIRST_CHALLENGES[0].id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    signIn(name);
    setStartScenario(challenge);
    router.push("/learn");
  }

  return (
    <MotionProvider>
      <AuthShell
        title={t("Buat profilmu.", "Create your profile.")}
        subtitle={t(
          "Satu layar, lalu kamu langsung berada di dalam percakapan. Atribut komunikasimu mulai dari netral dan hanya bergerak ketika ada yang bereaksi padamu.",
          "One screen, then you are inside a conversation. Your communication attributes start neutral and move only when someone reacts to you.",
        )}
        quote={{
          line: t(
            "Fasih itu tahu kata-katanya. Noera itu tahu ruangannya.",
            "Fluency is knowing the words. Noera is knowing the room.",
          ),
          caption: t(
            "Profilmu adalah catatan tentang bagaimana perasaan orang setelah bicara denganmu — bukan berapa hari berturut-turut kamu membuka aplikasi.",
            "Your profile is a record of how people felt after talking to you — not how many days in a row you opened an app.",
          ),
        }}
        footer={
          <>
            {t("Sudah punya profil? ", "Already have a profile? ")}
            <Link href="/signin" className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] font-semibold text-ink underline underline-offset-4">
              {t("Masuk", "Sign in")}
            </Link>
          </>
        }
      >
        <DemoLogin label={t("Lewati — masuk sebagai juri", "Skip — enter as a reviewer")} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            label={t("Nama", "Name")}
            name="name"
            placeholder={t("Orang sebaiknya memanggilmu apa?", "How should people address you?")}
            autoComplete="name"
          />
          <AuthField
            label="Email"
            name="email"
            type="email"
            placeholder="kamu@contoh.com"
            autoComplete="email"
          />
          <AuthField
            label={t("Kata sandi", "Password")}
            name="password"
            type="password"
            placeholder={t("Minimal 8 karakter", "At least 8 characters")}
            autoComplete="new-password"
          />

          <fieldset>
            <legend className="eyebrow text-mute">
              {t("Pilih tantangan pertamamu", "Choose your first challenge")}
            </legend>
            <p className="mt-1.5 text-[12.5px] text-mute">
              {t(
                "Ini ruangan pertama yang kamu masuki — bukan negara, melainkan sebuah situasi.",
                "This is the room you walk into first — not a country, a situation.",
              )}
            </p>
            <div className="mt-3 grid gap-2">
              {FIRST_CHALLENGES.map((s) => {
                const active = challenge === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setChallenge(s.id)}
                    className={`flex items-start gap-3 rounded-[0.9rem] border px-3.5 py-3 text-left transition-colors ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-line bg-white hover:border-ink/40"
                    }`}
                  >
                    <span className="mt-0.5">
                      <Flag code={s.flag} size={22} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold leading-snug">
                        {tr(s.title)}
                      </span>
                      <span
                        className={`mt-0.5 block text-[11.5px] leading-snug ${
                          active ? "text-cream/60" : "text-mute"
                        }`}
                      >
                        {s.city} · {tr(s.tension)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <HandNote className="mt-2" color="#b04a19">
              {t("kamu bisa ganti ruangan kapan saja", "you can change rooms any time")}
            </HandNote>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-full bg-ember-deep px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(255,107,53,0.28)] transition-colors hover:bg-clay"
          >
            {t("Masuk ke skenario pertamamu", "Enter your first scenario")}
          </button>
        </form>
      </AuthShell>
    </MotionProvider>
  );
}
