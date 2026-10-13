// Shared pill-button styles for the two hero actions.
const BASE =
  "inline-flex min-h-[52px] items-center justify-center gap-3.5 whitespace-nowrap rounded-full px-[23px] text-pf-0 font-semibold no-underline transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white";

export const ACTION_PRIMARY = `${BASE} bg-white text-[#122f66] shadow-[0_8px_32px_rgb(7_28_104/0.27)]`;
export const ACTION_SECONDARY = `${BASE} cursor-pointer border border-white/80 bg-white/10 font-[inherit] text-white backdrop-blur-[9px] hover:bg-white/20`;
