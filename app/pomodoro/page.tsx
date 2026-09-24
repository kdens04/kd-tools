import type { Metadata } from "next";
import { huninn } from "@/lib/fonts";
import SiteHeader from "../_components/site-header";
import PomodoroTimer from "./pomodoro-timer";

export const metadata: Metadata = {
  title: "專注蕃茄鐘 | kd-tools",
  description: "25 分鐘專注、5 分鐘休息，幫你維持工作節奏",
};

export default function PomodoroPage() {
  return (
    <>
      <SiteHeader />
      <main
        className={`${huninn.className} flex flex-1 flex-col text-[#5b3a29]`}
      >
        <PomodoroTimer />
      </main>
    </>
  );
}
