export default function GrainBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden grain">
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-sky-300/40 blobA" />
      <div className="absolute right-[-240px] top-10 h-[620px] w-[620px] rounded-full bg-amber-300/35 blobB" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbfaf7] via-[#fbfaf7] to-[#f6f4ee]" />
    </div>
  );
}
