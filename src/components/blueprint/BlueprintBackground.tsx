import { CmjnChips, Plus, RegTarget } from "./marks";

/**
 * Code-native blueprint backdrop: CSS gradients + grids, with an inline SVG
 * drafting overlay. Decorative only (aria-hidden, no pointer events); place it
 * as the first child of a `relative` container. Two scenes, toggled by CSS:
 * a landscape composition (lg+) and a portrait one for phones and tablets,
 * both spreading the technical marks evenly across the viewport.
 * Uses fixed ids (`bp-*`): mount a single instance per page.
 */
export function BlueprintBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`blueprint pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="blueprint-grid blueprint-grid-fine" />
      <div className="blueprint-grid blueprint-grid-strong" />
      <LandscapeScene />
      <PortraitScene />
    </div>
  );
}

function Hatch() {
  return (
    <defs>
      <pattern
        id="bp-hatch"
        width="9"
        height="9"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <path d="M0 0V9" className="bp-line bp-faint" />
      </pattern>
    </defs>
  );
}

function LandscapeScene() {
  return (
    <svg
      className="blueprint-svg hidden lg:block"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <Hatch />
      <path d="M0 118H1600M0 780H1600M120 0V900M1480 0V900" className="bp-line bp-faint" />
      <path d="M520 0V900M1060 0V900" className="bp-line bp-faint bp-dashed" />

      <path
        d="M105 110h30m-15-15v30M540 110h40m-20-20v40M1030 118h35m-17-17v34M1450 110h35m-18-18v36M120 785h25m-12-12v25M1475 785h22m-11-11v22"
        className="bp-line bp-strong"
      />

      <g>
        <circle cx={220} cy={292} r={124} className="bp-line bp-dashed" />
        <path d="M220 160v264m-125-132h250" className="bp-line bp-faint" />
        <circle cx={220} cy={292} r={15} className="bp-line bp-strong" />
        <path d="M680 175h70m-35-35v70" className="bp-line" />
        <circle cx={1145} cy={240} r={132} className="bp-line bp-dashed" />
        <path d="M1145 100v280m-140-140h280" className="bp-line bp-faint" />
        <circle cx={1145} cy={240} r={19} className="bp-line bp-strong" />
        <path d="M1310 620a180 180 0 0 0-310 90" className="bp-line bp-dashed" />
        <circle cx={405} cy={700} r={85} className="bp-line bp-dashed" />
        <path d="M370 700h70m-35-35v70" className="bp-line" />
      </g>

      <path
        d="M126 504h100m-50-50v100M1354 466h110m-55-55v110M695 750h70m-35-35v70M930 405h40m-20-20v40M1520 585h45m-22-22v44"
        className="bp-line"
      />

      {/* CMJN */}
      <text x={320} y={110} className="bp-text">CMJN</text>
      <CmjnChips x={320} y={120} />

      {/* process list */}
      <text className="bp-text">
        <tspan x={1270} y={110}>DÉCOUPE</tspan>
        <tspan x={1270} y={132}>PLIAGE</tspan>
        <tspan x={1270} y={154}>FAÇONNAGE</tspan>
        <tspan x={1270} y={176}>IMPRESSION</tspan>
      </text>

      {/* ruler */}
      <path d="M1420 250v220" className="bp-line bp-strong" />
      <path d="M1408 250h22m-16 55h16m-22 55h22m-16 55h16m-22 55h22" className="bp-line" />
      <text className="bp-text bp-text-sm">
        <tspan x={1440} y={255}>300 mm</tspan>
        <tspan x={1440} y={363}>150 mm</tspan>
        <tspan x={1440} y={475}>0 mm</tspan>
      </text>

      {/* A4 outline */}
      <path d="M220 622h135v96H220z" className="bp-line bp-dashed" />
      <path d="M244 622h64v96h-64z" fill="url(#bp-hatch)" stroke="rgb(255 255 255 / 0.5)" />
      <text x={220} y={744} className="bp-text bp-text-sm">A4 · 210 × 297 mm</text>

      {/* format outline */}
      <path d="M1130 695h160v90h-160z" className="bp-line bp-dashed" />
      <path d="M1165 695h65v90h-65z" fill="url(#bp-hatch)" stroke="rgb(255 255 255 / 0.5)" />
      <text x={1130} y={812} className="bp-text bp-text-sm">FORMAT · PRINT</text>
    </svg>
  );
}

/** Portrait composition (phones, tablets): fewer marks, spread top to bottom. */
function PortraitScene() {
  return (
    <svg
      className="blueprint-svg lg:hidden"
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <Hatch />
      <path d="M0 90H600M0 810H600M70 0V900M530 0V900" className="bp-line bp-faint" />
      <Plus x={70} y={90} size={14} strong />
      <Plus x={530} y={90} size={14} strong />
      <Plus x={70} y={810} size={14} strong />
      <Plus x={530} y={810} size={14} strong />

      <circle cx={150} cy={250} r={100} className="bp-line bp-dashed" />
      <RegTarget x={150} y={250} r={13} arm={110} />
      <circle cx={470} cy={560} r={110} className="bp-line bp-dashed" />
      <RegTarget x={470} y={560} r={16} arm={120} />
      <circle cx={170} cy={720} r={70} className="bp-line bp-dashed" />
      <Plus x={170} y={720} size={20} />

      <Plus x={300} y={175} size={20} />
      <Plus x={300} y={470} size={14} />
      <Plus x={420} y={690} size={16} />
      <Plus x={105} y={450} size={12} />

      <text x={392} y={126} className="bp-text">CMJN</text>
      <CmjnChips x={392} y={134} w={13} h={10} />

      <path d="M135 600h90v62h-90z" className="bp-line bp-dashed" />
      <path d="M152 600h44v62h-44z" fill="url(#bp-hatch)" stroke="rgb(255 255 255 / 0.5)" />
      <text x={135} y={684} className="bp-text bp-text-sm">A4 · 210 × 297 mm</text>
    </svg>
  );
}
