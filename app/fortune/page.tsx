import type { Metadata } from "next";
import { huninn } from "@/lib/fonts";
import SiteHeader from "../_components/site-header";
import FortuneDraw from "./fortune-draw";

export const metadata: Metadata = {
  title: "好運抽籤 | kd-tools",
  description: "搖一搖籤筒，看看今天的運勢",
};

export default function FortunePage() {
  return (
    <>
      <SiteHeader />
      <main
        className={`${huninn.className} flex flex-1 flex-col items-center px-4 py-10 text-[#5b3a29]`}
        style={{
          backgroundColor: "#fff4e8",
          backgroundImage: "radial-gradient(#ffd3c2 2px, transparent 2px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3 text-4xl sm:text-5xl">
            <span className="animate-wiggle inline-block">⛩️</span>
            <h1 className="text-4xl tracking-wide [text-shadow:3px_3px_0_#ffd36e] sm:text-5xl">
              好運抽籤
            </h1>
            <span className="animate-wiggle inline-block [animation-delay:0.4s]">
              🍀
            </span>
          </div>
          <p className="text-lg text-[#8a6a58]">
            心裡默念想問的事，搖一搖籤筒～
          </p>
        </header>
        <FortuneDraw />
      </main>
    </>
  );
}
