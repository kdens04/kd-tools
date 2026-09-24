"use client";

import { useEffect, useRef, useState } from "react";
import { drawFortune, type Fortune } from "./fortunes";
import { playBad, playGood, playPop, playShake, unlockAudio } from "./sounds";

type Phase = "idle" | "shaking" | "popped" | "revealed";

const INK = "#5b3a29";
const SHAKE_MS = 1300;
const POP_MS = 700;

const card =
  "rounded-3xl border-4 border-[#5b3a29] bg-white shadow-[6px_6px_0_#5b3a29]";

export default function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const busy = phase === "shaking" || phase === "popped";

  function draw() {
    if (busy) return;
    const result = drawFortune();

    unlockAudio();
    playShake(SHAKE_MS);
    setFortune(null);
    setPhase("shaking");

    timers.current.push(
      setTimeout(() => {
        playPop();
        setPhase("popped");
      }, SHAKE_MS),
      setTimeout(() => {
        if (result.level.good) playGood();
        else playBad();
        setFortune(result);
        setPhase("revealed");
      }, SHAKE_MS + POP_MS),
    );
  }

  const mood =
    phase === "shaking"
      ? "dizzy"
      : phase === "revealed" && fortune
        ? fortune.level.good
          ? "happy"
          : "sad"
        : "idle";

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
      <section className="flex flex-col items-center gap-6 pt-16 lg:w-80">
        <div
          className={`w-56 origin-bottom ${phase === "shaking" ? "animate-shake" : ""}`}
        >
          <FortuneCan
            mood={mood}
            stickOut={phase === "popped" || phase === "revealed"}
          />
        </div>
        <button
          type="button"
          onClick={draw}
          disabled={busy}
          className="rounded-full border-4 border-[#5b3a29] bg-[#ff6b6b] px-10 py-3 text-2xl text-white shadow-[0_6px_0_#5b3a29] transition [text-shadow:2px_2px_0_#5b3a29] hover:-translate-y-0.5 hover:bg-[#ff5252] active:translate-y-1.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {busy ? "搖搖搖～" : fortune ? "再抽一次" : "搖一搖抽籤"}
        </button>
      </section>

      <section className="w-full max-w-md" aria-live="polite">
        {fortune ? (
          <FortuneCard fortune={fortune} />
        ) : (
          <div
            className={`${card} flex min-h-80 flex-col items-center justify-center gap-3 border-dashed p-8 text-center text-[#8a6a58] shadow-none`}
          >
            <span className="text-5xl">📜</span>
            <p className="text-lg">
              {busy ? "神明正在幫你挑籤…" : "今天的籤詩會出現在這裡～"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FortuneCard({ fortune }: { fortune: Fortune }) {
  const { level } = fortune;
  return (
    <article
      key={fortune.number + level.name + fortune.message}
      className={`${card} animate-pop overflow-hidden`}
    >
      <div
        className="flex items-center justify-between border-b-4 border-[#5b3a29] px-5 py-2 text-white [text-shadow:1px_1px_0_#5b3a29]"
        style={{ backgroundColor: level.color }}
      >
        <span>⛩️ 今日運勢</span>
        <span>第 {fortune.number} 籤</span>
      </div>

      <div className="flex flex-col items-center gap-5 p-6">
        <div
          className="flex h-32 w-32 items-center justify-center rounded-full border-[6px] bg-[#fffaf2] text-5xl tracking-widest shadow-[4px_4px_0_#5b3a29]"
          style={{ borderColor: level.color, color: level.color }}
        >
          {level.name}
        </div>

        <p className="text-center text-xl leading-relaxed text-balance">{fortune.message}</p>

        <div className="grid w-full grid-cols-2 gap-3">
          {fortune.aspects.map((a) => (
            <div
              key={a.name}
              className="flex flex-col items-center rounded-2xl bg-[#fff4e8] py-2"
            >
              <span className="text-sm text-[#8a6a58]">{a.name}</span>
              <span
                className="text-lg tracking-wider"
                aria-label={`${a.stars} 顆星`}
              >
                <span className="text-[#f2a900]">{"★".repeat(a.stars)}</span>
                <span className="text-[#e3d5c3]">
                  {"★".repeat(5 - a.stars)}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-3 gap-3 text-center">
          <Lucky label="幸運色">
            <span
              className="mr-1 inline-block h-4 w-4 rounded-full border-2 border-[#5b3a29] align-[-2px]"
              style={{ backgroundColor: fortune.color.value }}
            />
            {fortune.color.name}
          </Lucky>
          <Lucky label="幸運物">{fortune.item}</Lucky>
          <Lucky label="幸運數字">{fortune.luckyNumber}</Lucky>
        </div>

        {!level.good && (
          <p className="rounded-2xl bg-[#efeaf8] px-4 py-2 text-center text-sm text-[#6b5b8a]">
            💡 把壞籤綁在樹上，霉運就會留在這裡囉！
          </p>
        )}
      </div>
    </article>
  );
}

function Lucky({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border-[3px] border-dashed border-[#ffd3c2] px-2 py-2">
      <span className="text-xs text-[#8a6a58]">{label}</span>
      <span className="text-base">{children}</span>
    </div>
  );
}

// 籤筒角色：平常微笑、搖晃時暈頭轉向、抽到好籤開心、抽到壞籤哭哭
export function FortuneCan({
  mood,
  stickOut,
}: {
  mood: "idle" | "dizzy" | "happy" | "sad";
  stickOut: boolean;
}) {
  const sticks = [
    { x: 72, y: 38, r: -14 },
    { x: 86, y: 28, r: -6 },
    { x: 114, y: 30, r: 7 },
    { x: 128, y: 40, r: 15 },
  ];

  return (
    <svg
      viewBox="0 0 200 260"
      overflow="visible"
      className="w-full"
      aria-hidden
    >
      {/* 筒口 */}
      <ellipse
        cx={100}
        cy={86}
        rx={58}
        ry={14}
        fill="#b8403f"
        stroke={INK}
        strokeWidth={5}
      />

      {sticks.map((s) => (
        <rect
          key={s.x}
          x={s.x - 5}
          y={s.y}
          width={10}
          height={90}
          rx={5}
          fill="#e8c48a"
          stroke={INK}
          strokeWidth={3}
          transform={`rotate(${s.r} ${s.x} 110)`}
        />
      ))}

      {/* 被抽中的那一支，會往上跳出來 */}
      <g
        style={{
          transform: stickOut ? "translateY(-62px)" : "translateY(0)",
          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <rect
          x={94}
          y={22}
          width={12}
          height={96}
          rx={6}
          fill="#f3d6a4"
          stroke={INK}
          strokeWidth={3}
        />
        <rect
          x={94}
          y={22}
          width={12}
          height={20}
          rx={6}
          fill="#ff6b6b"
          stroke={INK}
          strokeWidth={3}
        />
        {stickOut && (
          <text x={120} y={30} fontSize={22} fill="#f2a900">
            ✦
          </text>
        )}
      </g>

      {/* 筒身 */}
      <path
        d="M42 86 L 42 222 Q 42 246 66 246 L 134 246 Q 158 246 158 222 L 158 86 Q 100 104 42 86 Z"
        fill="#ff6b6b"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path
        d="M42 112 Q 100 128 158 112 L 158 128 Q 100 144 42 128 Z"
        fill="#ffd36e"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <ellipse cx={62} cy={170} rx={6} ry={16} fill="white" opacity={0.45} />
      <circle
        cx={100}
        cy={165}
        r={19}
        fill="#fffaf2"
        stroke={INK}
        strokeWidth={4}
      />
      <text
        x={100}
        y={166}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={22}
        fill={INK}
      >
        籤
      </text>

      {/* 表情 */}
      {mood === "idle" && (
        <>
          <circle cx={80} cy={206} r={5} fill={INK} />
          <circle cx={120} cy={206} r={5} fill={INK} />
          <path
            d="M92 218 Q 100 226 108 218"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}
      {mood === "dizzy" && (
        <>
          <path
            d="M73 200 L 85 206 L 73 212 M127 200 L 115 206 L 127 212"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M88 222 Q 94 216 100 222 Q 106 228 112 222"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}
      {mood === "happy" && (
        <>
          <path
            d="M72 208 Q 80 198 88 208 M112 208 Q 120 198 128 208"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M90 216 Q 100 232 110 216 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </>
      )}
      {mood === "sad" && (
        <>
          <circle cx={80} cy={206} r={5} fill={INK} />
          <circle cx={120} cy={206} r={5} fill={INK} />
          <path
            d="M77 214 Q 74 222 77 226 A 3 3 0 0 0 83 224 Q 82 220 77 214 Z"
            fill="#a8d8f0"
            stroke={INK}
            strokeWidth={1.5}
          />
          <path
            d="M92 226 Q 100 218 108 226"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}
      <ellipse cx={66} cy={216} rx={8} ry={4.5} fill="#ffb5a7" />
      <ellipse cx={134} cy={216} rx={8} ry={4.5} fill="#ffb5a7" />
    </svg>
  );
}
