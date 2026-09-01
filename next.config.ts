import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * Folder induk di mesin ini menyimpan package-lock.json milik proyek lain,
 * sehingga Turbopack menyimpulkan akar ruang kerja di luar folder karya dan
 * menandainya sebagai peringatan di overlay pengembangan. Menyebutkan akarnya
 * secara eksplisit membuat karya ini berdiri sendiri: hasilnya sama di mesin
 * mana pun, tidak peduli berkas apa yang kebetulan ada di folder di atasnya.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
