"use client";

import { useEffect, useRef, useState } from "react";
import { playStart, playTick, playWin, unlockAudio } from "./sounds";

const DEFAULT_OPTIONS = ["便當", "義大利麵", "火鍋", "鐵板燒", "牛肉麵", "炒飯"];

const FOOD_EMOJI: Record<string, string> = {
  便當: "🍱",
  義大利麵: "🍝",
  火鍋: "🍲",
  鐵板燒: "🥩",
  牛肉麵: "🍜",
  炒飯: "🍚",
};

const COLORS = [
  "#ffb5a7",
  "#ffe08a",
  "#b8e6c9",
  "#a8d8f0",
  "#cdb4f0",
  "#ffc6da",
  "#ffcb8e",
  "#d6efa0",
];

const INK = "#5b3a29";
const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 8;
const SPIN_MS = 5000;
const EXTRA_TURNS = 6;

// 角度以「從正上方順時針」計算，指針固定在正上方
function pointAt(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
}

function sectorPath(start: number, end: number) {
  const a = pointAt(start, RADIUS);
  const b = pointAt(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${a.x} ${a.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
}

function sectorColor(i: number, count: number) {
  // 避免最後一格和第一格顏色相同而連在一起
  if (count > 1 && i === count - 1 && i % COLORS.length === 0) {
    return COLORS[3];
  }
  return COLORS[i % COLORS.length];
}

function emojiFor(name: string) {
  return FOOD_EMOJI[name] ?? "🍽️";
}

function truncate(name: string, max: number) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

// 從 CSS transform 讀出目前實際的旋轉角度（0~360）
function currentAngle(el: Element) {
  const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
  const deg = (Math.atan2(m.b, m.a) * 180) / Math.PI;
  return (deg + 360) % 360;
}

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

const card =
  "rounded-3xl border-4 border-[#5b3a29] bg-white shadow-[6px_6px_0_#5b3a29]";

export default function LotteryWheel() {
  const [input, setInput] = useState(DEFAULT_OPTIONS.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [pendingWinner, setPendingWinner] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const names = input
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
  const count = names.length;
  const segment = count > 0 ? 360 / count : 360;
  const fontSize = count > 20 ? 12 : count > 12 ? 15 : 20;
  const emojiSize = count > 20 ? 14 : count > 12 ? 20 : 30;
  const maxChars = count > 12 ? 5 : 6;

  function spin() {
    if (spinning || count === 0) return;

    const index = randomInt(count);
    const center = (index + 0.5) * segment;
    // 在格子內加一點隨機偏移，看起來比較自然，但不會壓到邊界
    const jitter = (randomInt(1000) / 1000 - 0.5) * segment * 0.7;
    const target = (((-(center + jitter) - rotation) % 360) + 360) % 360;

    setWinner(null);
    setPendingWinner(names[index]);
    setSpinning(true);
    setRotation(rotation + EXTRA_TURNS * 360 + target);

    unlockAudio();
    playStart();
    startTicking(rotation);
  }

  // 每一幀追蹤轉盤角度，指針每跨過一格就「喀」一聲
  function startTicking(from: number) {
    let total = from;
    let prev = from % 360;
    let lastSlot = Math.floor(total / segment);

    const loop = () => {
      const el = wheelRef.current;
      if (!el) return;
      const angle = currentAngle(el);
      total += (angle - prev + 360) % 360;
      prev = angle;

      const slot = Math.floor(total / segment);
      if (slot !== lastSlot) {
        lastSlot = slot;
        playTick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function handleSpinEnd() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setSpinning(false);
    setWinner(pendingWinner);
    playWin();
  }

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start">
      <section className={`${card} flex w-full flex-col gap-3 p-5 lg:w-80`}>
        <label htmlFor="names" className="text-xl">
          📝 今天的候選菜單
        </label>
        <p className="text-sm text-[#8a6a58]">一行一個，想吃什麼自己加～</p>
        <textarea
          id="names"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={spinning}
          rows={10}
          className="w-full resize-y rounded-2xl border-[3px] border-dashed border-[#ffb5a7] bg-[#fffaf2] p-3 text-lg leading-relaxed text-[#5b3a29] outline-none focus:border-solid focus:border-[#ff8fa3] disabled:opacity-60"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="rounded-full bg-[#ffe08a] px-3 py-1">
            共 {count} 個選項
          </span>
          <div className="flex gap-3 text-[#8a6a58]">
            <button
              type="button"
              onClick={() => setInput(DEFAULT_OPTIONS.join("\n"))}
              disabled={spinning}
              className="hover:text-[#5b3a29] disabled:opacity-40"
            >
              恢復預設
            </button>
            <button
              type="button"
              onClick={() => setInput("")}
              disabled={spinning || input === ""}
              className="hover:text-[#5b3a29] disabled:opacity-40"
            >
              清空
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center gap-6">
        <div className="relative w-full max-w-[420px] p-2">
          {/* 指針 */}
          <svg
            viewBox="0 0 40 52"
            className="absolute left-1/2 -top-3 z-20 w-10 -translate-x-1/2 drop-shadow-[0_3px_0_#5b3a29]"
            aria-hidden
          >
            <path
              d="M20 49 C 14 38, 4 26, 4 17 A 16 16 0 0 1 36 17 C 36 26, 26 38, 20 49 Z"
              fill="#ff8fa3"
              stroke={INK}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <circle cx={20} cy={17} r={6} fill="white" stroke={INK} strokeWidth={3} />
          </svg>

          <svg
            ref={wheelRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full drop-shadow-[6px_6px_0_#5b3a29]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.7, 0.1, 1)`
                : "none",
            }}
            onTransitionEnd={handleSpinEnd}
          >
            {count === 0 ? (
              <>
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#f3e6d3" />
                <text
                  x={CENTER}
                  y={CENTER + 70}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#8a6a58"
                  fontSize={20}
                >
                  先寫下想吃的東西吧～
                </text>
              </>
            ) : (
              names.map((name, i) => {
                const start = i * segment;
                const mid = start + segment / 2;
                return (
                  <g key={i}>
                    {count === 1 ? (
                      <circle
                        cx={CENTER}
                        cy={CENTER}
                        r={RADIUS}
                        fill={sectorColor(i, count)}
                      />
                    ) : (
                      <path
                        d={sectorPath(start, start + segment)}
                        fill={sectorColor(i, count)}
                        stroke={INK}
                        strokeWidth={3}
                        strokeLinejoin="round"
                      />
                    )}
                    <g transform={`rotate(${mid - 90} ${CENTER} ${CENTER})`}>
                      <text
                        x={CENTER + RADIUS * 0.8}
                        y={CENTER}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={emojiSize}
                        transform={`rotate(90 ${CENTER + RADIUS * 0.8} ${CENTER})`}
                      >
                        {emojiFor(name)}
                      </text>
                      <text
                        x={CENTER + RADIUS * 0.47}
                        y={CENTER}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={INK}
                        fontSize={fontSize}
                      >
                        {truncate(name, maxChars)}
                      </text>
                    </g>
                  </g>
                );
              })
            )}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={INK}
              strokeWidth={6}
            />
          </svg>

          {/* 中心的笑臉（不跟著轉）：平常微笑、轉動中「喔～」、抽中後流口水 */}
          <svg
            viewBox="0 0 80 80"
            overflow="visible"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[19%] -translate-x-1/2 -translate-y-1/2"
            aria-hidden
          >
            <circle cx={40} cy={40} r={36} fill="#fff6e5" stroke={INK} strokeWidth={5} />
            {winner ? (
              <>
                {/* 陶醉的 ^ ^ 眼睛 */}
                <path
                  d="M21 38 Q 27 29 33 38 M47 38 Q 53 29 59 38"
                  fill="none"
                  stroke={INK}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <ellipse cx={19} cy={47} rx={7} ry={4} fill="#ff8fa3" />
                <ellipse cx={61} cy={47} rx={7} ry={4} fill="#ff8fa3" />
              </>
            ) : (
              <>
                <circle cx={28} cy={36} r={4.5} fill={INK} />
                <circle cx={52} cy={36} r={4.5} fill={INK} />
                <ellipse cx={20} cy={48} rx={6} ry={3.5} fill="#ffb5a7" />
                <ellipse cx={60} cy={48} rx={6} ry={3.5} fill="#ffb5a7" />
              </>
            )}
            {winner ? (
              <>
                {/* 張開的嘴和舌頭 */}
                <path
                  d="M29 47 Q 40 64 51 47 Z"
                  fill={INK}
                  stroke={INK}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <ellipse cx={40} cy={54.5} rx={5} ry={3} fill="#ff8fa3" />
                {/* 從嘴角滴下來的口水 */}
                <g className="animate-drool [transform-box:fill-box] [transform-origin:top]">
                  <path
                    d="M49 50 C 49.5 53, 49.5 55, 49.3 57.5 A 1.9 1.9 0 0 0 53.1 57.5 C 53 55, 52.3 52, 51 47.5 Z"
                    fill="#cdeefc"
                    stroke={INK}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  />
                  <circle cx={50.6} cy={57.6} r={0.7} fill="white" />
                </g>
              </>
            ) : spinning ? (
              <ellipse cx={40} cy={52} rx={6} ry={7} fill={INK} />
            ) : (
              <path
                d="M32 48 Q 40 57 48 48"
                fill="none"
                stroke={INK}
                strokeWidth={4}
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || count === 0}
          className="rounded-full border-4 border-[#5b3a29] bg-[#ff8fa3] px-12 py-3 text-2xl text-white shadow-[0_6px_0_#5b3a29] transition [text-shadow:2px_2px_0_#5b3a29] hover:-translate-y-0.5 hover:bg-[#ff7a92] active:translate-y-1.5 active:shadow-[0_0_0_#5b3a29] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {spinning ? "轉轉轉～" : "轉起來！"}
        </button>

        <div className="flex min-h-24 items-center" aria-live="polite">
          {winner && (
            <div
              key={rotation}
              className={`${card} animate-pop flex items-center gap-3 bg-[#fff1b8] px-8 py-4`}
            >
              <span className="text-4xl">{emojiFor(winner)}</span>
              <p className="text-2xl">
                今天就吃
                <span className="mx-1 text-3xl text-[#ff6b86]">{winner}</span>
                吧！
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
