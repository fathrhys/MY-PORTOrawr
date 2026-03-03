"use client";

import { useEffect, useMemo, useState } from "react";

export default function RolesClient() {
  const roles = useMemo(() => ["Web Developer", "CTF Player", "Student", "Cloud Engineer", "Bug Hunter"], []);
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    const full = roles[idx];

    if (typing) {
      // type in
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), 35);
      } else {
        t = setTimeout(() => setTyping(false), 900);
      }
    } else {
      // delete
      if (text.length > 0) {
        t = setTimeout(() => setText(full.slice(0, text.length - 1)), 18);
      } else {
        t = setTimeout(() => {
          setTyping(true);
          setIdx((p) => (p + 1) % roles.length);
        }, 120);
      }
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [idx, roles, text, typing]);

  return (
    <p className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">
      <span className="text-black">Im A  </span>
      <span className="font-semibold text-black">
        {text}
        <span className="animate-pulse">|</span>
      </span>
    </p>
  );
}
