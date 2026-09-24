// 用 Web Audio API 即時合成音效，不需要額外的音檔

let ctx: AudioContext | null = null;

// 瀏覽器規定 AudioContext 必須在使用者操作（例如點擊）後才能發聲，
// 所以在按下按鈕時呼叫這個函式來建立 / 喚醒它
export function unlockAudio() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function tone(
  freq: number,
  start: number,
  duration: number,
  {
    type = "sine" as OscillatorType,
    volume = 0.2,
    endFreq,
  }: { type?: OscillatorType; volume?: number; endFreq?: number } = {},
) {
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq)
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}
