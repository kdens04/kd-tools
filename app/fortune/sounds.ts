import { tone } from "@/lib/audio";

export { unlockAudio } from "@/lib/audio";

// 搖籤筒：一連串木籤碰撞的「喀啦喀啦」
export function playShake(duration: number) {
  const hits = Math.floor(duration / 90);
  for (let i = 0; i < hits; i++) {
    const f = 650 + Math.random() * 500;
    tone(f, i * 0.09, 0.045, {
      type: "square",
      endFreq: f * 0.5,
      volume: 0.07,
    });
  }
}

// 籤從筒子裡跳出來：「啵！」
export function playPop() {
  tone(400, 0, 0.16, { type: "sine", endFreq: 1300, volume: 0.25 });
}

// 好籤：清脆的鈴鐺琶音
export function playGood() {
  const notes = [1046.5, 1318.5, 1568, 2093]; // C6 E6 G6 C7
  notes.forEach((f, i) => {
    tone(f, i * 0.09, 0.5, { type: "sine", volume: 0.2 });
  });
  tone(2637, 0.4, 0.8, { type: "sine", volume: 0.1 });
}

// 壞籤：搞笑的「哇～哇～哇～」
export function playBad() {
  tone(392, 0, 0.35, { type: "triangle", endFreq: 370, volume: 0.25 });
  tone(370, 0.38, 0.35, { type: "triangle", endFreq: 349, volume: 0.25 });
  tone(349, 0.76, 0.8, { type: "triangle", endFreq: 262, volume: 0.25 });
}
