import { CmjnChips, Crosshair, Plus, RegTarget } from "./marks";

/**
 * Code-native blueprint backdrop: CSS gradients + grids, with an inline SVG
 * drafting overlay. Decorative only (aria-hidden, no pointer events); place it
 * as the first child of a `relative` container. Two SVG scenes are rendered and
 * toggled by CSS: a full composition (md+) and a reduced one for phones.
 * Uses fixed ids (`bp-*`), so mount a single instance per page.
 */
export function BlueprintBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`blueprint pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="blueprint-grid blueprint-grid-fine" />
      <div className="blueprint-grid blueprint-grid-strong" />
      <DesktopScene />
      <MobileScene />
    </div>
  );
}

const TEXT = "bp-text";

function Defs() {
  return (
    <defs>
      <pattern
        id="bp-hatch"
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <path d="M0 0V7" className="bp-line" />
      </pattern>
    </defs>
  );
}

function DesktopScene() {
  return (
    <svg
      className="blueprint-svg hidden md:block"
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <Defs />

      {/* frame + registration corners */}
      <path d="M0 88H1672M0 852H1672" className="bp-line bp-faint" />
      <path d="M100 0V941M1572 0V941" className="bp-line bp-faint" />
      <path d="M973 0V941M863 0V941" className="bp-line bp-dashed bp-faint" />
      <path d="M1205 420H1672" className="bp-line bp-dashed bp-faint" />
      <Plus x={100} y={88} />
      <Plus x={1572} y={88} />
      <Plus x={100} y={852} />
      <Plus x={1572} y={852} />

      {/* crosshairs and pluses */}
      <Crosshair x={480} y={58} arm={30} tall={40} />
      <Crosshair x={160} y={199} arm={30} tall={30} />
      <path d="M160 199V290" className="bp-line bp-faint" />
      <Crosshair x={1180} y={90} arm={140} tall={90} />
      <Plus x={931} y={517} />
      <Plus x={1428} y={419} />
      <Plus x={1566} y={593} size={30} />
      <Plus x={1362} y={887} size={20} />
      <Plus x={864} y={557} size={12} />
      <Plus x={1416} y={692} size={26} />
      <Plus x={100} y={199} size={14} />
      <path d="M713 868V905" className="bp-line" />

      {/* registration targets */}
      <RegTarget x={766} y={494} r={18} arm={110} />
      <RegTarget x={1017} y={92} r={18} arm={70} />
      <RegTarget x={1285} y={288} r={18} arm={60} />
      <RegTarget x={130} y={471} r={12} arm={30} />

      {/* construction arcs */}
      <circle cx={1080} cy={308} r={138} className="bp-line bp-dashed" />
      <Plus x={1070} y={349} size={22} />
      <circle cx={1194} cy={234} r={4.5} className="bp-dot" />
      <circle cx={1217} cy={309} r={4.5} className="bp-dot" />
      <path d="M1105 548A168 188 0 0 1 1415 660" className="bp-line bp-dashed" />
      <path d="M1415 660H1672" className="bp-line bp-faint" />
      <path d="M60 298A170 170 0 0 1 60 632" className="bp-line bp-dashed" />

      {/* CMJN */}
      <text x={881} y={147} className={TEXT}>
        CMJN
      </text>
      <CmjnChips x={881} y={158} />

      {/* process list */}
      <path d="M1286 150V280" className="bp-line bp-faint" />
      <text className={TEXT} x={1302}>
        <tspan x={1302} y={162}>DÉCOUPE</tspan>
        <tspan x={1302} y={185}>PLIAGE</tspan>
        <tspan x={1302} y={208}>FAÇONNAGE</tspan>
        <tspan x={1302} y={232}>IMPRESSION</tspan>
      </text>

      {/* 0–300 mm ruler */}
      <path d="M1478 145V357" className="bp-line" />
      {Array.from({ length: 31 }, (_, i) => {
        const y = 357 - i * (212 / 30);
        const major = i % 10 === 0;
        const mid = i % 5 === 0;
        const len = major ? 12 : mid ? 9 : 5;
        return (
          <path
            key={i}
            d={`M${1478 - len} ${y}H1478`}
            className="bp-line"
          />
        );
      })}
      <path d="M1470 357H1486M1470 145H1486" className="bp-line" />
      <text className={`${TEXT} bp-text-sm`}>
        <tspan x={1501} y={150}>300 mm</tspan>
        <tspan x={1501} y={220}>200 mm</tspan>
        <tspan x={1501} y={291}>100 mm</tspan>
        <tspan x={1501} y={361}>0 mm</tspan>
      </text>

      {/* A4 illustrative outline */}
      <rect x={945} y={609} width={169} height={111} className="bp-line bp-dashed" />
      <rect x={975} y={609} width={85} height={111} fill="url(#bp-hatch)" />
      <rect x={975} y={609} width={85} height={111} className="bp-line" />
      <path d="M1086 609V720" className="bp-line bp-dashed" />
      <text className={`${TEXT} bp-text-sm`}>
        <tspan x={1138} y={677}>A4</tspan>
        <tspan x={1138} y={695}>210 × 297 mm</tspan>
      </text>
    </svg>
  );
}

/** Reduced composition for narrow screens: fewer marks, fewer labels. */
function MobileScene() {
  return (
    <svg
      className="blueprint-svg md:hidden"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <Defs />

      <path d="M0 64H390M0 780H390" className="bp-line bp-faint" />
      <path d="M16 0V844M374 0V844" className="bp-line bp-faint" />
      <Plus x={16} y={64} size={8} />
      <Plus x={374} y={64} size={8} />
      <Plus x={16} y={780} size={8} />
      <Plus x={374} y={780} size={8} />

      <Crosshair x={300} y={120} arm={22} tall={30} />
      <RegTarget x={70} y={640} r={12} arm={50} />
      <Plus x={330} y={430} size={9} />
      <Plus x={40} y={300} size={12} />

      <circle cx={330} cy={560} r={110} className="bp-line bp-dashed" />
      <circle cx={376} cy={460} r={3.5} className="bp-dot" />
      <path d="M0 220A90 90 0 0 1 0 400" className="bp-line bp-dashed" />

      <text x={24} y={806} className={`${TEXT} bp-text-sm`}>CMJN</text>
      <CmjnChips x={24} y={814} size={10} />

      <rect x={240} y={700} width={90} height={60} className="bp-line bp-dashed" />
      <rect x={256} y={700} width={46} height={60} fill="url(#bp-hatch)" />
      <rect x={256} y={700} width={46} height={60} className="bp-line" />
      <text className={`${TEXT} bp-text-sm`}>
        <tspan x={240} y={776}>A4 · 210 × 297 mm</tspan>
      </text>
    </svg>
  );
}
