export type Level = {
  name: string;
  // 抽中機率的權重，數字越大越容易抽到
  weight: number;
  // 1~5，決定各項運勢星星的基準
  score: number;
  good: boolean;
  color: string;
  messages: string[];
};

export const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 10,
    score: 5,
    good: true,
    color: "#ff5c5c",
    messages: [
      "好運滿滿！今天做什麼都順風順水，勇敢去衝吧！",
      "天時地利人和，想做的事情今天就開始！",
      "貴人就在身邊，多和朋友聊聊會有驚喜～",
    ],
  },
  {
    name: "中吉",
    weight: 15,
    score: 4,
    good: true,
    color: "#ff8a4c",
    messages: [
      "運勢很不錯！努力會有看得見的回報。",
      "今天的直覺特別準，相信自己的判斷吧！",
      "適合學新東西，吸收力超好～",
    ],
  },
  {
    name: "小吉",
    weight: 20,
    score: 3,
    good: true,
    color: "#f2a900",
    messages: [
      "小小的幸運會一直出現，留意身邊的小確幸～",
      "平穩中帶點好運，按部就班就對了。",
      "今天適合整理環境，會讓心情變好喔！",
    ],
  },
  {
    name: "吉",
    weight: 20,
    score: 3,
    good: true,
    color: "#4fbf80",
    messages: [
      "平平安安就是福，今天過得舒服自在～",
      "保持笑容，好運會慢慢靠過來！",
      "吃頓好吃的犒賞自己，運氣會更上一層樓。",
    ],
  },
  {
    name: "末吉",
    weight: 15,
    score: 2,
    good: true,
    color: "#5aa9e0",
    messages: [
      "運勢正在慢慢上升中，耐心等待就會開花！",
      "先苦後甘，下午之後會越來越順～",
      "別急著做決定，多想一下會更好。",
    ],
  },
  {
    name: "凶",
    weight: 12,
    score: 2,
    good: false,
    color: "#8e7cc3",
    messages: [
      "今天小心行事，出門前多檢查一下隨身物品喔。",
      "容易有小誤會，說話前先深呼吸～",
      "不適合衝動購物，錢包要看緊！",
    ],
  },
  {
    name: "大凶",
    weight: 8,
    score: 1,
    good: false,
    color: "#6b6b8a",
    messages: [
      "運氣跌到谷底……但接下來只會往上走啦！",
      "今天低調一點，早點休息，明天又是新的開始。",
      "大凶其實很稀有，抽到也是一種運氣呢（？）",
    ],
  },
];

export const ASPECTS = ["工作運", "財運", "愛情運", "健康運"] as const;

export const LUCKY_COLORS = [
  { name: "櫻花粉", value: "#ffb7c5" },
  { name: "薄荷綠", value: "#98e2c6" },
  { name: "天空藍", value: "#87cefa" },
  { name: "檸檬黃", value: "#fff176" },
  { name: "薰衣草紫", value: "#c3a6ff" },
  { name: "蜜桃橘", value: "#ffb38a" },
  { name: "奶茶棕", value: "#d7b899" },
  { name: "純淨白", value: "#ffffff" },
];

export const LUCKY_ITEMS = [
  "珍珠奶茶",
  "雞排",
  "小籠包",
  "鳳梨酥",
  "便利商店的飯糰",
  "一杯熱咖啡",
  "藍色原子筆",
  "耳機",
  "雨傘",
  "小盆栽",
  "筆記本",
  "零錢包",
  "襪子",
  "御守",
  "貓咪貼圖",
];

export function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick<T>(list: readonly T[]) {
  return list[randomInt(list.length)];
}

function pickLevel() {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let r = randomInt(total);
  for (const level of LEVELS) {
    if (r < level.weight) return level;
    r -= level.weight;
  }
  return LEVELS[LEVELS.length - 1];
}

export type Fortune = {
  number: number;
  level: Level;
  message: string;
  aspects: { name: string; stars: number }[];
  color: (typeof LUCKY_COLORS)[number];
  item: string;
  luckyNumber: number;
};

export function drawFortune(): Fortune {
  const level = pickLevel();
  return {
    number: randomInt(100) + 1,
    level,
    message: pick(level.messages),
    // 各項運勢以整體籤等為基準，上下浮動一顆星
    aspects: ASPECTS.map((name) => ({
      name,
      stars: Math.min(5, Math.max(1, level.score + randomInt(3) - 1)),
    })),
    color: pick(LUCKY_COLORS),
    item: pick(LUCKY_ITEMS),
    luckyNumber: randomInt(99) + 1,
  };
}
