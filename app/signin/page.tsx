"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { AuthField, AuthShell, DemoLogin } from "@/components/kairos/AuthShell";
import { useProgress } from "@/lib/kairos/state";
import { useT } from "@/lib/kairos/i18n";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useProgress();
  const t = useT();

  return (
    <MotionProvider>
      <AuthShell
        title={t("Selamat datang kembali.", "Welcome back.")}
        subtitle={t(
          "Hubunganmu masih persis di tempat kamu meninggalkannya. Prof. Sato masih ingat kalimat terakhirmu.",
          "Your relationships are where you left them. Prof. Sato still remembers the last thing you said.",
        )}
        quote={{
          line: t("Percakapannya berlanjut tanpa kamu.", "The conversation continued without you."),
          caption: t(
            "Posisi, kepercayaan, dan kecocokan budaya tetap tersimpan antar sesi — memperbaiki hubungan juga bagian dari kurikulumnya.",
            "Standing, trust and cultural fit persist between sessions — repair is part of the curriculum.",
          ),
        }}
        footer={
          <>
            {t("Baru di sini? ", "New here? ")}
            <Link href="/signup" className="relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] font-semibold text-ink underline underline-offset-4">
              {t("Buat profil", "Create a profile")}
            </Link>
          </>
        }
      >
        <DemoLogin />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email") ?? "");
            // Name the session after the address they typed, before the @.
            signIn(email.split("@")[0]);
            router.push("/learn");
          }}
          className="space-y-4"
        >
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
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {/* "Lupa kata sandi?" dihapus dari sini. Isinya <span cursor-pointer>:
              terlihat bisa diklik, tidak bisa dijangkau keyboard, dan tidak
              melakukan apa pun — sekaligus bertentangan dengan janji halaman
              ini sendiri, yang memang tanpa kata sandi.

              Label-nya dibuat setinggi 44px supaya kotak centang 16px punya
              sasaran sentuh yang layak; yang diketuk memang seluruh barisnya. */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex min-h-[44px] items-center gap-2 text-[13.5px] text-mute">
              <input type="checkbox" className="h-4 w-4 accent-[#1c1512]" defaultChecked />
              {t("Biarkan saya tetap masuk", "Keep me signed in")}
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-cream transition-colors hover:bg-espresso"
          >
            {t("Lanjutkan dari terakhir kali", "Continue where you left off")}
          </button>
        </form>
      </AuthShell>
    </MotionProvider>
  );
}
