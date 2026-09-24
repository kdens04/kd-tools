import Link from "next/link";
import { TOOLS } from "./tools";

export default function SiteFooter() {
  return (
    <footer className="relative bg-[#5b3a29] text-[#fff6e5]">
      {/* 頂端的波浪 */}
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute -top-[39px] left-0 h-10 w-full"
        aria-hidden
      >
        <path
          d="M0 40 C 120 0, 240 0, 360 20 S 600 40, 720 20 S 960 0, 1080 20 S 1320 40, 1440 10 L 1440 40 Z"
          fill="#5b3a29"
        />
      </svg>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-8 sm:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-[#fff6e5] bg-[#ffb5a7] text-xl">
              🧰
            </span>
            <span className="text-2xl tracking-wide">KD的小工具箱</span>
          </div>
          <p className="max-w-sm leading-relaxed text-[#e8d5c4]">
            一些讓生活更可愛一點的小工具。
            <br />
            打開瀏覽器就能用，不用安裝、不用註冊。
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg text-[#ffd36e]">小工具</h2>
          <ul className="flex flex-col gap-2">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="text-[#e8d5c4] transition hover:text-white"
                >
                  {tool.emoji} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-dashed border-[#8a6a58]">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-[#c9b09c]">
          © 2026 KD的小工具箱 · Made with 💖 &amp; Next.js
        </p>
      </div>
    </footer>
  );
}
