"use client";

import { useEffect, useRef, useState } from "react";
import {
  playBreakDone,
  playCountdown,
  playFocusDone,
  playPause,
  playStart,
  unlockAudio,
} from "./sounds";
import { restoreTitle } from "./title";

type Mode = "focus" | "short" | "long";

const MIN = 60_000;
const LONG_EVERY = 4;
const INK = "#5b3a29";

const MODES: Record<
  Mode,
  {
    label: string;
    emoji: string;
    accent: string;
    bg: string;
    dots: string;
    idleText: string;
    runningText: string;
    max: number;
  }
> = {
  focus: {
    label: "專注",
    emoji: "🍅",
    accent: "#ff6b6b",
    bg: "#fff0ea",
    dots: "#ffc9bb",
    idleText: "準備好就開始吧！",
    runningText: "專心工作中，加油！",
    max: 90,
  },
  short: {
    label: "短休息",
    emoji: "☕",
    accent: "#4fbf80",
    bg: "#effaf2",
    dots: "#bfe8cc",
    idleText: "喝口水、伸個懶腰～",
    runningText: "放鬆一下，等等再繼續～",
    max: 30,
  },
  long: {
    label: "長休息",
    emoji: "🛋️",
    accent: "#5aa9e0",
    bg: "#eef7fd",
    dots: "#bfe0f5",
    idleText: "辛苦了！好好休息一下",
    runningText: "好好充電中～",
    max: 60,
  },
};

const card =
  "rounded-3xl border-4 border-[#5b3a29] bg-white shadow-[6px_6px_0_#5b3a29]";

function formatTime(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const [durations, setDurations] = useState<Record<Mode, number>>({
    focus: 25,
    short: 5,
    long: 15,
  });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * MIN);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const endAtRef = useRef(0);
  const lastSecondRef = useRef(0);

  const theme = MODES[mode];
  const total = durations[mode] * MIN;
  const progress = 1 - remaining / total;

  // 用「結束時間」計算剩餘時間，分頁在背景被降速也不會跑偏
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, endAtRef.current - Date.now());
      const sec = Math.ceil(left / 1000);
      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        if (sec > 0 && sec <= 5) playCountdown();
      }
      if (left > 0) {
        setRemaining(left);
        return;
      }

      setRunning(false);
      restoreTitle();
      let next: Mode = "focus";
      if (mode === "focus") {
        const done = completed + 1;
        setCompleted(done);
        next = done % LONG_EVERY === 0 ? "long" : "short";
        setMessage(
          next === "long"
            ? `完成第 ${done} 顆蕃茄！來個長休息吧 🎉`
            : `完成第 ${done} 顆蕃茄！休息一下吧～`,
        );
        playFocusDone();
      } else {
        setMessage("休息結束，回來繼續努力囉！");
        playBreakDone();
      }
      setMode(next);
      setRemaining(durations[next] * MIN);
    }, 200);
    return () => clearInterval(id);
  }, [running, mode, completed, durations]);

  // 計時中在分頁標題顯示剩餘時間。
  // 停止時由 pause / goTo / 時間到 各自還原標題，不在 effect cleanup 裡還原——
  // cleanup 在換頁時會比 Next.js 設定新頁面標題還晚執行，會把別頁的標題蓋掉
  useEffect(() => {
    if (!running) return;
    document.title = `${formatTime(remaining)} ${theme.emoji} ${theme.label} | 專注蕃茄鐘`;
  }, [running, remaining, theme]);

  function start() {
    unlockAudio();
    playStart();
    endAtRef.current = Date.now() + remaining;
    lastSecondRef.current = Math.ceil(remaining / 1000);
    setMessage(null);
    setRunning(true);
  }

  function pause() {
    playPause();
    setRemaining(Math.max(0, endAtRef.current - Date.now()));
    setRunning(false);
    restoreTitle();
  }

  function goTo(next: Mode) {
    setRunning(false);
    restoreTitle();
    setMode(next);
    setRemaining(durations[next] * MIN);
    setMessage(null);
  }

  function reset() {
    goTo(mode);
  }

  function skip() {
    if (mode === "focus") {
      goTo((completed + 1) % LONG_EVERY === 0 ? "long" : "short");
    } else {
      goTo("focus");
    }
  }

  function changeDuration(m: Mode, delta: number) {
    const value = Math.min(MODES[m].max, Math.max(1, durations[m] + delta));
    setDurations({ ...durations, [m]: value });
    if (m === mode) setRemaining(value * MIN);
  }

  const face = running
    ? mode === "focus"
      ? "focus"
      : "rest"
    : mode === "focus"
      ? "idle"
      : "rest";
  const untilLong = LONG_EVERY - (completed % LONG_EVERY);

  return (
    <div
      className="flex flex-1 flex-col items-center px-4 py-10 transition-colors duration-500"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(${theme.dots} 2px, transparent 2px)`,
        backgroundSize: "28px 28px",
      }}
    >
      <header className="mb-6 flex flex-col items-center gap-2 text-center">
        <h1
          className="text-4xl tracking-wide sm:text-5xl"
          style={{ textShadow: `3px 3px 0 ${theme.dots}` }}
        >
          專注蕃茄鐘
        </h1>
        <p className="text-lg text-[#8a6a58]">
          {running ? theme.runningText : theme.idleText}
        </p>
      </header>

      <nav className="mb-6 flex gap-2 rounded-full border-4 border-[#5b3a29] bg-white p-1.5 shadow-[4px_4px_0_#5b3a29]">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => goTo(m)}
            className="rounded-full px-4 py-1.5 text-lg transition sm:px-5"
            style={
              m === mode
                ? { backgroundColor: MODES[m].accent, color: "white" }
                : undefined
            }
          >
            {MODES[m].emoji} {MODES[m].label}
          </button>
        ))}
      </nav>

      <section
        className={`${card} flex w-full max-w-md flex-col items-center gap-4 rounded-[40px] px-6 py-8`}
      >
        <div className="relative w-full max-w-[300px]">
          <svg viewBox="0 0 320 320" className="w-full -rotate-90">
            <circle
              cx={160}
              cy={160}
              r={145}
              fill="#fffaf2"
              stroke={INK}
              strokeWidth={5}
            />
            <circle
              cx={160}
              cy={160}
              r={128}
              fill="none"
              stroke="#f3e6d3"
              strokeWidth={18}
            />
            <circle
              cx={160}
              cy={160}
              r={128}
              fill="none"
              stroke={theme.accent}
              strokeWidth={18}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              style={{
                transition: "stroke-dashoffset 0.25s linear, stroke 0.5s",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Tomato face={face} bouncing={running} />
          </div>
        </div>

        <p className="text-7xl tabular-nums tracking-wider">
          {formatTime(remaining)}
        </p>

        <div
          className="flex min-h-7 items-center text-center text-lg"
          aria-live="polite"
        >
          {message && (
            <span
              key={message + completed}
              className="animate-pop"
              style={{ color: theme.accent }}
            >
              {message}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <RoundButton label="重新開始" onClick={reset}>
            ↺
          </RoundButton>
          <button
            type="button"
            onClick={running ? pause : start}
            className="min-w-40 rounded-full border-4 border-[#5b3a29] px-10 py-3 text-2xl text-white shadow-[0_6px_0_#5b3a29] transition [text-shadow:2px_2px_0_#5b3a29] hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-none"
            style={{ backgroundColor: theme.accent }}
          >
            {running ? "暫停" : remaining < total ? "繼續" : "開始"}
          </button>
          <RoundButton label="跳過" onClick={skip}>
            ⏭
          </RoundButton>
        </div>
      </section>

      <div className="mt-8 grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        <section className={`${card} flex flex-col gap-3 p-5`}>
          <h2 className="text-xl">🏆 今天的成果</h2>
          <p className="text-3xl">
            {completed}
            <span className="ml-1 text-lg text-[#8a6a58]">顆蕃茄</span>
          </p>
          <div className="flex min-h-8 flex-wrap gap-1 text-2xl">
            {completed === 0 ? (
              <span className="text-base text-[#8a6a58]">
                還沒有蕃茄，開始第一顆吧！
              </span>
            ) : (
              Array.from({ length: Math.min(completed, 16) }, (_, i) => (
                <span key={i} className="animate-pop">
                  🍅
                </span>
              ))
            )}
            {completed > 16 && (
              <span className="self-center text-base">+{completed - 16}</span>
            )}
          </div>
          <p className="text-sm text-[#8a6a58]">
            再完成 {untilLong} 顆就能長休息
          </p>
        </section>

        <section className={`${card} flex flex-col gap-3 p-5`}>
          <h2 className="text-xl">⚙️ 時間設定（分鐘）</h2>
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <div key={m} className="flex items-center justify-between">
              <span className="text-lg">
                {MODES[m].emoji} {MODES[m].label}
              </span>
              <div className="flex items-center gap-2">
                <Stepper
                  disabled={running || durations[m] <= 1}
                  onClick={() => changeDuration(m, -1)}
                >
                  −
                </Stepper>
                <span className="w-8 text-center text-xl tabular-nums">
                  {durations[m]}
                </span>
                <Stepper
                  disabled={running || durations[m] >= MODES[m].max}
                  onClick={() => changeDuration(m, 1)}
                >
                  ＋
                </Stepper>
              </div>
            </div>
          ))}
          {running && (
            <p className="text-sm text-[#8a6a58]">計時中不能修改，先暫停喔</p>
          )}
        </section>
      </div>
    </div>
  );
}

function RoundButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#5b3a29] bg-white text-2xl shadow-[0_4px_0_#5b3a29] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
    >
      {children}
    </button>
  );
}

function Stepper({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#5b3a29] bg-[#ffe08a] text-lg leading-none shadow-[0_3px_0_#5b3a29] transition active:translate-y-0.5 active:shadow-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// 蕃茄角色：idle 微笑、focus 綁頭巾認真臉、rest 瞇眼放鬆
export function Tomato({
  face,
  bouncing,
}: {
  face: "idle" | "focus" | "rest";
  bouncing: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-[62%] ${bouncing ? "animate-bob" : ""}`}
      aria-hidden
    >
      <ellipse
        cx={100}
        cy={120}
        rx={80}
        ry={68}
        fill="#ff6b6b"
        stroke={INK}
        strokeWidth={5}
      />
      <ellipse
        cx={58}
        cy={96}
        rx={13}
        ry={7}
        fill="white"
        opacity={0.6}
        transform="rotate(-35 58 96)"
      />
      <rect
        x={95}
        y={26}
        width={10}
        height={22}
        rx={5}
        fill="#5a9e5a"
        stroke={INK}
        strokeWidth={3}
      />
      <path
        d="M100 42 L112 56 L134 52 L119 66 L128 82 L106 72 L100 86 L94 72 L72 82 L81 66 L66 52 L88 56 Z"
        fill="#7bc67b"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {face === "focus" && (
        <>
          {/* 頭巾 */}
          <path
            d="M24 104 Q 100 80 176 104 L 176 118 Q 100 94 24 118 Z"
            fill="white"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <circle cx={100} cy={99} r={7} fill="#ff6b6b" />
          <path
            d="M174 108 L 194 96 L 190 114 Z M174 112 L 192 124 L 180 128 Z"
            fill="white"
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {/* 認真的眉毛和眼睛 */}
          <path
            d="M66 120 L 86 126 M134 120 L 114 126"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx={78} cy={136} r={6} fill={INK} />
          <circle cx={122} cy={136} r={6} fill={INK} />
          <circle cx={80} cy={134} r={2} fill="white" />
          <circle cx={124} cy={134} r={2} fill="white" />
          <path
            d="M92 156 Q 100 152 108 156"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}

      {face === "idle" && (
        <>
          <circle cx={78} cy={124} r={6.5} fill={INK} />
          <circle cx={122} cy={124} r={6.5} fill={INK} />
          <circle cx={80} cy={122} r={2.2} fill="white" />
          <circle cx={124} cy={122} r={2.2} fill="white" />
          <path
            d="M90 142 Q 100 152 110 142"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}

      {face === "rest" && (
        <>
          <path
            d="M68 128 Q 78 118 88 128 M112 128 Q 122 118 132 128"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M88 142 Q 100 160 112 142 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <text x={158} y={62} fontSize={30} fill={INK}>
            ♪
          </text>
        </>
      )}

      <ellipse cx={58} cy={146} rx={11} ry={6} fill="#ffb5a7" />
      <ellipse cx={142} cy={146} rx={11} ry={6} fill="#ffb5a7" />
    </svg>
  );
}
