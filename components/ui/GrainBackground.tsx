export default function GrainBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden grain">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-sky-300/40 dark:bg-sky-500/20 blobA blur-[80px]" />
      <div className="absolute right-[-240px] top-10 h-[620px] w-[620px] rounded-full bg-amber-300/35 dark:bg-amber-500/15 blobB blur-[80px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbfaf7]/80 via-[#fbfaf7]/60 to-[#f6f4ee]/80 dark:from-[#0b0f17]/90 dark:via-[#0b0f17]/80 dark:to-[#0f172a]/80" />
    </div>
  );
}
