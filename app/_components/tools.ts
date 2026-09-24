// 首頁、header、footer 共用的工具清單
export const TOOLS = [
  {
    href: "/lottery",
    emoji: "🍱",
    name: "要吃什麼勒？",
    short: "吃什麼",
    color: "#ff8fa3",
    soft: "#ffe3e8",
    description:
      "選擇困難症救星！把想吃的東西寫上去，轉盤一轉，今天的午餐就決定了。",
    tags: ["自訂選項", "轉盤動畫", "喀喀音效"],
  },
  {
    href: "/pomodoro",
    emoji: "🍅",
    name: "專注蕃茄鐘",
    short: "蕃茄鐘",
    color: "#ff6b6b",
    soft: "#ffe4dc",
    description:
      "25 分鐘專心、5 分鐘休息。綁著頭巾的小蕃茄會陪你一起努力，累積今天的成果。",
    tags: ["專注／休息", "自訂時間", "結束提醒"],
  },
  {
    href: "/fortune",
    emoji: "🎋",
    name: "好運抽籤",
    short: "抽籤",
    color: "#f2a900",
    soft: "#fff1c9",
    description:
      "搖一搖籤筒，從大吉到大凶，看看今天的工作運、財運、愛情運和幸運物。",
    tags: ["七種籤等", "四項運勢", "幸運小物"],
  },
] as const;
