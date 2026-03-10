"use client";

import { TypeAnimation } from "react-type-animation";

export default function RolesClient() {
  return (
    <div className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
      <span>I&apos;m a </span>
      <TypeAnimation
        sequence={[
          "Cloud & DevOps Engineer",
          2000,
          "Web Developer",
          2000,
          "CTF Player",
          2000,
          "Cloud Anthusiast",
          2000,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-400 drop-shadow-sm"
      />
    </div>
  );
}
