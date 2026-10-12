// Drafting primitives shared by the desktop and mobile blueprint scenes.
// All geometry is in the parent SVG's user units; strokes use
// vector-effect so line weight stays constant when the scene scales.

type Point = { x: number; y: number };

export function Plus({ x, y, size = 10 }: Point & { size?: number }) {
  return (
    <path
      d={`M${x - size} ${y}H${x + size}M${x} ${y - size}V${y + size}`}
      className="bp-line"
    />
  );
}

export function Crosshair({
  x,
  y,
  arm = 30,
  tall = arm,
}: Point & { arm?: number; tall?: number }) {
  return (
    <path
      d={`M${x - arm} ${y}H${x + arm}M${x} ${y - tall}V${y + tall}`}
      className="bp-line"
    />
  );
}

/** Registration target: ringed cross with long, fading arms. */
export function RegTarget({
  x,
  y,
  r = 18,
  arm = 60,
}: Point & { r?: number; arm?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bp-line" />
      <path
        d={`M${x - arm} ${y}H${x + arm}M${x} ${y - arm}V${y + arm}`}
        className="bp-line bp-faint"
      />
      <path
        d={`M${x - r - 6} ${y}H${x + r + 6}M${x} ${y - r - 6}V${y + r + 6}`}
        className="bp-line"
      />
    </g>
  );
}

export function CmjnChips({ x, y, size = 13 }: Point & { size?: number }) {
  const chips = ["#00c8ff", "#ff2fa8", "#ffe600", "#1a1a1f"];
  return (
    <g>
      {chips.map((fill, i) => (
        <rect
          key={fill}
          x={x + i * (size + 6)}
          y={y}
          width={size}
          height={size}
          fill={fill}
        />
      ))}
    </g>
  );
}
