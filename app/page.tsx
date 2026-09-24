import Link from "next/link";
import { huninn } from "@/lib/fonts";
import { FortuneCan } from "./fortune/fortune-draw";
import { Tomato } from "./pomodoro/pomodoro-timer";
import SiteFooter from "./_components/site-footer";
import SiteHeader from "./_components/site-header";
import { TOOLS } from "./_components/tools";

const INK = "#5b3a29";

const FEATURES = [
  {
    emoji: "🎨",
    title: "Q 版可愛風",
    text: "圓圓的字、軟軟的顏色，每個工具都有自己的小角色。",
  },
  {
    emoji: "🔊",
    title: "療癒小音效",
    text: "轉盤喀喀、蕃茄叮咚、籤筒喀啦，按下去就很舒壓。",
  },
  {
    emoji: "📱",
    title: "打開就能用",
    text: "免安裝、免註冊，電腦和手機都可以直接使用。",
  },
];

const dots = {
  backgroundImage: "radial-gradient(#ffd9a8 2px, transparent 2px)",
  backgroundSize: "28px 28px",
};

export default function Home() {
  return (
    <div className={`${huninn.className} flex flex-1 flex-col text-[#5b3a29]`}>
      <SiteHeader />

      <main className="flex-1 bg-[#fff6e5]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#fff6e5]" style={dots}>
          <Sparkle className="top-6 left-[3%] text-[#ffb5a7]" />
          <Sparkle className="top-1/3 right-[6%] text-[#ffd36e] [animation-delay:0.6s]" />
          <Sparkle className="bottom-24 left-[46%] text-[#a8d8f0] [animation-delay:1.1s]" />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-24 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-32">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span className="rounded-full border-[3px] border-[#5b3a29] bg-white px-4 py-1 text-sm shadow-[3px_3px_0_#5b3a29]">
                ✨ 3 個可愛小工具 · 免安裝打開就能用
              </span>
              <h1 className="text-6xl leading-tight tracking-wide sm:text-7xl">
                KD的
                <br />
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-6px] bottom-2 h-5 -rotate-1 rounded-full bg-[#ffd36e]" />
                  <span className="relative">小工具箱</span>
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-[#8a6a58]">
                {
                  "幫你決定今天吃什麼、陪你專心把事情做完，再抽支籤看看今天運氣如何。"
                }
                <br />
                一些讓生活更可愛一點的小工具 🧸
              </p>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <a
                  href="#tools"
                  className="rounded-full border-4 border-[#5b3a29] bg-[#ff8fa3] px-8 py-3 text-xl text-white shadow-[0_6px_0_#5b3a29] transition [text-shadow:2px_2px_0_#5b3a29] hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-none"
                >
                  逛逛工具箱 ↓
                </a>
                <Link
                  href="/lottery"
                  className="rounded-full border-4 border-[#5b3a29] bg-white px-8 py-3 text-xl shadow-[0_6px_0_#5b3a29] transition hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-none"
                >
                  🍱 今天吃什麼？
                </Link>
              </div>
            </div>

            {/* 三個角色像貼紙一樣散在右邊 */}
            <div className="relative mx-auto aspect-square w-full max-w-[440px]">
              <div className="absolute inset-[12%] rounded-full border-4 border-dashed border-[#ffc9bb] bg-white/60" />
              <div className="animate-bob absolute top-[2%] left-[2%] w-[48%] rotate-[-8deg]">
                <MiniWheel />
              </div>
              <div className="animate-bob absolute top-[24%] right-[0%] w-[44%] rotate-[6deg] [animation-delay:0.4s]">
                <div className="flex aspect-square items-center justify-center rounded-full border-4 border-[#5b3a29] bg-[#ffe4dc] shadow-[5px_5px_0_#5b3a29]">
                  <Tomato face="idle" bouncing={false} />
                </div>
              </div>
              <div className="animate-bob absolute bottom-[0%] left-[14%] w-[30%] rotate-[-4deg] [animation-delay:0.8s]">
                <FortuneCan mood="happy" stickOut={false} />
              </div>
            </div>
          </div>

          <Wave fill="#fffaf2" />
        </section>

        {/* 工具介紹 */}
        <section id="tools" className="scroll-mt-20 bg-[#fffaf2] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle label="TOOLS" title="工具箱裡有什麼？" />

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {TOOLS.map((tool, i) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col overflow-hidden rounded-[32px] border-4 border-[#5b3a29] bg-white shadow-[6px_6px_0_#5b3a29] transition duration-300 hover:-translate-y-2 hover:rotate-[-1deg] hover:shadow-[10px_12px_0_#5b3a29]"
                >
                  <div
                    className="relative flex h-52 items-center justify-center border-b-4 border-[#5b3a29]"
                    style={{
                      backgroundColor: tool.soft,
                      backgroundImage: `radial-gradient(${tool.color}33 2px, transparent 2px)`,
                      backgroundSize: "20px 20px",
                    }}
                  >
                    <span className="absolute top-4 left-4 rounded-full border-[3px] border-[#5b3a29] bg-white px-3 text-sm">
                      0{i + 1}
                    </span>
                    <div className="w-36 transition duration-300 group-hover:scale-110 group-hover:rotate-[4deg]">
                      <ToolArt href={tool.href} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="text-2xl">
                      {tool.emoji} {tool.name}
                    </h3>
                    <p className="leading-relaxed text-[#8a6a58]">
                      {tool.description}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full px-3 py-0.5 text-sm"
                          style={{ backgroundColor: tool.soft }}
                        >
                          # {tag}
                        </li>
                      ))}
                    </ul>
                    <span
                      className="mt-auto inline-flex w-fit items-center gap-1 rounded-full border-[3px] border-[#5b3a29] px-5 py-1.5 text-white shadow-[0_4px_0_#5b3a29] [text-shadow:1px_1px_0_#5b3a29]"
                      style={{ backgroundColor: tool.color }}
                    >
                      去玩玩看
                      <span className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 特色 */}
        <section className="bg-[#fff6e5] py-20" style={dots}>
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle label="WHY" title="為什麼會想一直打開？" />
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex flex-col items-center gap-3 rounded-3xl border-4 border-[#5b3a29] bg-white p-6 text-center shadow-[6px_6px_0_#5b3a29]"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#5b3a29] bg-[#fff1c9] text-3xl">
                    {f.emoji}
                  </span>
                  <h3 className="text-xl">{f.title}</h3>
                  <p className="leading-relaxed text-[#8a6a58]">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 結尾 CTA */}
        <section className="bg-[#fff6e5] px-4 pb-28">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 overflow-hidden rounded-[40px] border-4 border-[#5b3a29] bg-[#ffb5a7] px-6 py-12 text-center shadow-[8px_8px_0_#5b3a29]">
            <span className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[#ffd36e]/70" />
            <span className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full bg-[#ffc6da]" />
            <p className="relative text-3xl sm:text-4xl">
              今天也要過得開心喔！
            </p>
            <p className="relative text-lg text-[#6b4636]">
              不知道從哪個開始？那就……讓抽籤決定吧 🎋
            </p>
            <Link
              href="/fortune"
              className="relative rounded-full border-4 border-[#5b3a29] bg-white px-8 py-3 text-xl shadow-[0_6px_0_#5b3a29] transition hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-none"
            >
              抽一支看看 →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="rounded-full bg-[#5b3a29] px-4 py-0.5 text-sm tracking-[0.3em] text-[#fff6e5]">
        {label}
      </span>
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}

function ToolArt({ href }: { href: string }) {
  if (href === "/lottery") return <MiniWheel />;
  if (href === "/pomodoro")
    return (
      <div className="flex justify-center">
        {/* Tomato 本身只佔容器的 62%，放大容器讓它和其他插圖一樣大 */}
        <div className="flex w-[160%] shrink-0 justify-center">
          <Tomato face="focus" bouncing={false} />
        </div>
      </div>
    );
  return (
    <div className="mx-auto w-3/4">
      <FortuneCan mood="idle" stickOut={false} />
    </div>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`animate-wiggle pointer-events-none absolute text-4xl ${className}`}
    >
      ✦
    </span>
  );
}

function Wave({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-12 w-full"
      aria-hidden
    >
      <path
        d="M0 30 C 180 60, 360 0, 540 30 S 900 60, 1080 30 S 1320 0, 1440 30 L 1440 60 L 0 60 Z"
        fill={fill}
      />
    </svg>
  );
}

// 首頁用的小轉盤插圖（靜態）
function MiniWheel() {
  const items = ["🍱", "🍝", "🍲", "🥩", "🍜", "🍚"];
  const colors = [
    "#ffb5a7",
    "#ffe08a",
    "#b8e6c9",
    "#a8d8f0",
    "#cdb4f0",
    "#ffc6da",
  ];
  const c = 100;
  const r = 88;
  const seg = 360 / items.length;
  const point = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return [c + radius * Math.sin(rad), c - radius * Math.cos(rad)];
  };

  return (
    <svg
      viewBox="0 0 200 200"
      overflow="visible"
      className="w-full drop-shadow-[5px_5px_0_#5b3a29]"
      aria-hidden
    >
      {items.map((emoji, i) => {
        const [x1, y1] = point(i * seg, r);
        const [x2, y2] = point((i + 1) * seg, r);
        const [ex, ey] = point(i * seg + seg / 2, r * 0.62);
        return (
          <g key={i}>
            <path
              d={`M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
              fill={colors[i]}
              stroke={INK}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <text
              x={ex}
              y={ey}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={22}
            >
              {emoji}
            </text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={r} fill="none" stroke={INK} strokeWidth={5} />
      <circle
        cx={c}
        cy={c}
        r={14}
        fill="#fff6e5"
        stroke={INK}
        strokeWidth={4}
      />
      <path
        d="M100 22 L 112 0 L 88 0 Z"
        fill="#ff8fa3"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}
