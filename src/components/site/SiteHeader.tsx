export function SiteHeader() {
  return (
    <header className="relative z-[12] flex w-full items-center justify-between px-[clamp(22px,4vw,66px)] py-7 max-[700px]:px-5 max-[700px]:py-5">
      <p className="text-pf-2 font-[660] leading-none text-white max-[700px]:text-pf-1">
        printcom<span className="text-[#53bdff]">.</span>
      </p>
    </header>
  );
}
