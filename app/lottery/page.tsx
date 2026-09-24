import type { Metadata } from "next";
import { huninn } from "@/lib/fonts";
import SiteHeader from "../_components/site-header";
import LotteryWheel from "./lottery-wheel";

export const metadata: Metadata = {
  title: "要吃什麼勒？ | 小工具箱",
  description: "選擇困難？轉一下轉盤決定今天吃什麼",
};

export default function LotteryPage() {
  return (
    <>
      <SiteHeader />
      <main
        className={`${huninn.className} flex flex-1 flex-col items-center px-4 py-10 text-[#5b3a29]`}
        style={{
          backgroundColor: "#fff6e5",
          backgroundImage: "radial-gradient(#ffd9a8 2px, transparent 2px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3 text-4xl sm:text-5xl">
            <span className="animate-wiggle inline-block">🍙</span>
            <h1 className="text-4xl tracking-wide [text-shadow:3px_3px_0_#ffb5a7] sm:text-5xl">
              要吃什麼勒？
            </h1>
            <span className="animate-wiggle inline-block [animation-delay:0.4s]">
              🍤
            </span>
          </div>
          <p className="text-lg text-[#8a6a58]">肚子餓了嗎？轉一下就知道！</p>
        </header>
        <LotteryWheel />
      </main>
    </>
  );
}
