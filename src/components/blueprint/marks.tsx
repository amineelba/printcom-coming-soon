// Drafting primitives for the portrait blueprint scene.
// Strokes use vector-effect, so line weight stays constant when the scene scales.

type Point = { x: number; y: number };

export function Plus({
  x,
  y,
  size = 10,
  strong = false,
}: Point & { size?: number; strong?: boolean }) {
  return (
    <path
      d={`M${x - size} ${y}H${x + size}M${x} ${y - size}V${y + size}`}
      className={strong ? "bp-line bp-strong" : "bp-line"}
    />
  );
}

/** Ringed registration target with faint long arms. */
export function RegTarget({
  x,
  y,
  r = 15,
  arm = 60,
}: Point & { r?: number; arm?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="bp-line bp-strong" />
      <path
        d={`M${x - arm} ${y}H${x + arm}M${x} ${y - arm}V${y + arm}`}
        className="bp-line bp-faint"
      />
    </g>
  );
}

export function CmjnChips({
  x,
  y,
  w = 15,
  h = 12,
}: Point & { w?: number; h?: number }) {
  const chips = ["#00c9f8", "#eb27c5", "#fff52e", "#08102d"];
  return (
    <g>
      {chips.map((fill, i) => (
        <rect key={fill} x={x + i * (w + 4)} y={y} width={w} height={h} fill={fill} />
      ))}
    </g>
  );
}
