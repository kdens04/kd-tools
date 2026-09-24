import { tone } from "@/lib/audio";

export { unlockAudio } from "@/lib/audio";

// 開始轉：往上滑的「啵～」
export function playStart() {
  tone(300, 0, 0.25, { type: "triangle", endFreq: 900, volume: 0.25 });
}

// 指針經過每一格時的「喀」
export function playTick() {
  tone(1400, 0, 0.05, { type: "triangle", endFreq: 700, volume: 0.15 });
}

// 抽中：上行琶音 + 閃亮亮的尾音
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((f, i) => {
    tone(f, i * 0.1, 0.3, { type: "triangle", volume: 0.22 });
  });
  tone(1318.5, 0.42, 0.5, { type: "sine", volume: 0.15 });
  tone(1568, 0.5, 0.6, { type: "sine", volume: 0.12 });
}
