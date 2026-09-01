import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/kairos/RouteTransition";
import { BottomBar } from "@/components/kairos/BottomBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono hanya dipakai untuk label angka kecil dan Caveat untuk catatan tangan;
// keduanya tidak perlu ikut antre di jalur render pertama bersama font isi
// dan font judul. Pergeseran tata letak sudah nol, jadi penundaan ini aman.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// Wajah judul editorial. Hanya sumbu optical-size yang dimuat: perbandingan
// berdampingan menunjukkan sumbu SOFT/WONK tidak terlihat bedanya pada ukuran
// judul, sementara keduanya menambah 52KB di jalur render pertama.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

// Used only for the hand-written annotation layer — never for UI copy.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Noera — Learn the language. Understand the moment.",
  description:
    "Noera is an illustrated social simulation for language learners. Every sentence you choose changes how someone feels about you — practise context, culture and tone, not just vocabulary.",
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
  width: "device-width",
  initialScale: 1,
};

// Antarmukanya berbahasa Indonesia secara bawaan, jadi dokumennya harus bilang
// begitu juga — kalau tidak, pembaca layar melafalkan teks Indonesia dengan
// fonem Inggris. Tombol ID/EN memperbarui atribut ini lewat lib/kairos/i18n.ts.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <RouteTransition />
        {children}
        <BottomBar />
      </body>
    </html>
  );
}
