import { Huninn } from "next/font/google";

// justfont 粉圓體，Q 版頁面共用
export const huninn = Huninn({
  weight: "400",
  subsets: ["latin"],
  // Next.js 沒有這個字型的 fallback 尺寸資料，關掉以免每次編譯都跳警告
  adjustFontFallback: false,
});
