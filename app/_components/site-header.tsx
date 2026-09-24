import Link from "next/link";
import { huninn } from "@/lib/fonts";
import { TOOLS } from "./tools";

export default function SiteHeader() {
  return (
    <header
      className={`${huninn.className} sticky top-0 z-50 border-b-4 border-[#5b3a29] bg-[#fff6e5]/90 text-[#5b3a29] backdrop-blur`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-[#5b3a29] bg-[#ffb5a7] text-xl shadow-[2px_2px_0_#5b3a29] transition group-hover:rotate-[-8deg]">
            🧰
          </span>
          <span className="text-xl tracking-wide">KD的小工具箱</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              title={tool.name}
              className="rounded-full px-2.5 py-1.5 text-base transition hover:bg-white hover:shadow-[0_0_0_3px_#5b3a29] sm:px-3"
            >
              <span>{tool.emoji}</span>
              <span className="ml-1 hidden sm:inline">{tool.short}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
