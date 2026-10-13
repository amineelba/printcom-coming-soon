export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 pt-6 sm:px-10 md:px-16 md:pt-8">
      <p className="text-[1.75rem] font-medium leading-none tracking-tight text-white sm:text-[2.1rem]">
        printcom<span className="text-[#38a6ff]">.</span>
      </p>
      <p className="flex items-center gap-2.5 rounded-full border border-white/35 bg-[#0a2f8f]/70 px-4 py-2 text-sm text-white backdrop-blur-sm sm:px-5 sm:text-[0.95rem]">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-[#2f8cff]" />
        Site en préparation
      </p>
    </header>
  );
}
