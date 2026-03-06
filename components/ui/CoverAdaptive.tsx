"use client";

import { useState, type SyntheticEvent, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CoverAdaptive({
  url,
  tintClass,
}: {
  url?: string | null;
  tintClass?: string;
}) {
  const [objectPosition, setObjectPosition] = useState<"center" | "center top">("center top");
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax gerak sedikit ke bawah
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  if (url) {
    return (
      <div ref={ref} className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={url}
          alt="cover"
          style={{ objectPosition, y, scale: 1.2 }}
          className="h-full w-full object-cover transition-[object-position] duration-300"
          loading="lazy"
          onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
            const img = event.currentTarget;
            const isPortrait = img.naturalHeight > img.naturalWidth;
            setObjectPosition(isPortrait ? "center top" : "center");
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${tintClass ?? "from-black/0 via-black/0 to-black/0"
            }`}
        />
      </div>
    );
  }
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-white via-slate-50 to-amber-50">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_30%_20%,rgba(2,6,23,0.08),transparent_50%),radial-gradient(circle_at_70%_55%,rgba(2,6,23,0.06),transparent_55%)]" />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tintClass ?? "from-slate-500/10 via-transparent to-transparent"
          }`}
      />
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_65%)] opacity-40 [background-image:linear-gradient(to_right,rgba(2,6,23,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
