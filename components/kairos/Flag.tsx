/* Emoji flags do not render on most Windows browsers (they fall back to
   bare letter pairs), so the whole product draws its own. Simplified,
   hand-inked, consistent with the illustration style. */

const INK = "#1c1512";

const FLAGS: Record<string, React.ReactNode> = {
  JP: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#fdfbf7" />
      <circle cx="11" cy="7.5" r="4" fill="#bc002d" />
    </>
  ),
  DE: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#1a1a1a" />
      <path d="M0 5 H22 V10 H0 Z" fill="#c1272d" />
      <path d="M0 10 H22 V12.5 A2.5 2.5 0 0 1 19.5 15 H2.5 A2.5 2.5 0 0 1 0 12.5 Z" fill="#f0c419" />
    </>
  ),
  US: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#fdfbf7" />
      <path d="M0 2 H22 M0 5 H22 M0 8 H22 M0 11 H22 M0 14 H22" stroke="#b22234" strokeWidth="1.6" />
      <path d="M0 2.5 A2.5 2.5 0 0 1 2.5 0 H10 V7 H0 Z" fill="#2a3d7c" />
      <g fill="#fdfbf7">
        <circle cx="3" cy="2" r="0.7" />
        <circle cx="6.5" cy="2" r="0.7" />
        <circle cx="4.7" cy="4.5" r="0.7" />
        <circle cx="8.2" cy="4.5" r="0.7" />
      </g>
    </>
  ),
  KR: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#fdfbf7" />
      <path d="M7 7.5 a4 4 0 0 1 8 0 a2 2 0 0 1 -4 0 a2 2 0 0 0 -4 0 Z" fill="#cd2e3a" />
      <path d="M7 7.5 a4 4 0 0 0 8 0 a2 2 0 0 0 -4 0 a2 2 0 0 1 -4 0 Z" fill="#0047a0" />
      <g stroke={INK} strokeWidth="0.8" opacity="0.75">
        <path d="M3 4 L5 2.6 M3 5.4 L5 4" />
        <path d="M17 11 L19 9.6 M17 12.4 L19 11" />
      </g>
    </>
  ),
  ID: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#fdfbf7" />
      <path d="M0 2.5 A2.5 2.5 0 0 1 2.5 0 H19.5 A2.5 2.5 0 0 1 22 2.5 V7.5 H0 Z" fill="#ce1126" />
    </>
  ),
  FR: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#fdfbf7" />
      <path d="M0 2.5 A2.5 2.5 0 0 1 2.5 0 H7.3 V15 H2.5 A2.5 2.5 0 0 1 0 12.5 Z" fill="#0055a4" />
      <path d="M14.7 0 H19.5 A2.5 2.5 0 0 1 22 2.5 V12.5 A2.5 2.5 0 0 1 19.5 15 H14.7 Z" fill="#ef4135" />
    </>
  ),
  BR: (
    <>
      <rect width="22" height="15" rx="2.5" fill="#169b62" />
      <path d="M11 2 L20 7.5 L11 13 L2 7.5 Z" fill="#f0c419" />
      <circle cx="11" cy="7.5" r="3" fill="#0a2d8f" />
    </>
  ),
};

export const COUNTRY_LABEL: Record<string, string> = {
  JP: "Japan",
  DE: "Germany",
  US: "United States",
  KR: "South Korea",
  ID: "Indonesia",
  FR: "France",
  BR: "Brazil",
};

export function Flag({
  code,
  size = 22,
  className = "",
}: {
  code: string;
  size?: number;
  className?: string;
}) {
  const art = FLAGS[code];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 22 15"
      width={size}
      height={(size * 15) / 22}
      className={`inline-block shrink-0 align-[-0.15em] ${className}`}
      role="img"
      aria-label={COUNTRY_LABEL[code] ?? code}
    >
      {art}
      <rect
        x="0.4"
        y="0.4"
        width="21.2"
        height="14.2"
        rx="2.2"
        fill="none"
        stroke={INK}
        strokeWidth="0.8"
        opacity="0.55"
      />
    </svg>
  );
}
