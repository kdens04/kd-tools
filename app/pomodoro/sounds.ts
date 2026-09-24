import { tone } from "@/lib/audio";

export { unlockAudio } from "@/lib/audio";

// 開始計時：輕快的「啵啵」
export function playStart() {
  tone(523.25, 0, 0.12, { type: "triangle", volume: 0.22 });
  tone(783.99, 0.1, 0.18, { type: "triangle", volume: 0.22 });
}

// 暫停：往下滑的「咻～」
export function playPause() {
  tone(700, 0, 0.22, { type: "triangle", endFreq: 300, volume: 0.2 });
}

// 最後幾秒的倒數滴答
export function playCountdown() {
  tone(1200, 0, 0.08, { type: "sine", volume: 0.18 });
}

// 專注結束：歡樂的上行小樂句，該休息囉
export function playFocusDone() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]; // C E G C' G C'
  notes.forEach((f, i) => {
    tone(f, i * 0.13, 0.3, { type: "triangle", volume: 0.24 });
  });
  tone(1318.5, 0.8, 0.8, { type: "sine", volume: 0.15 });
}

// 休息結束：叮咚叮咚的提醒鈴，回來工作囉
export function playBreakDone() {
  [0, 0.7].forEach((start) => {
    tone(1046.5, start, 0.5, { type: "sine", volume: 0.25 });
    tone(783.99, start + 0.25, 0.6, { type: "sine", volume: 0.25 });
  });
}
