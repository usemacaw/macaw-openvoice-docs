'use client';

/**
 * Animated SVG visualization of the Macaw Runtime architecture.
 *
 * Layout (conceptual):
 *   REST    WebSocket    CLI          ← clients
 *      \       |       /
 *        API  Server                  ← entry point
 *            |
 *        Scheduler                    ← orchestration
 *        /        \
 *   STT Worker   TTS Worker          ← execution
 *
 * Dots flow continuously along the paths to communicate
 * real-time streaming and parallelism.
 */

const VIEWBOX = '0 0 720 460';

/* ── Palette (HSL strings for SVG fill/stroke) ─────────────── */

const C = {
  // Node fills — use semi-transparent so they work on any bg
  gold: 'var(--flow-gold, #d4a017)',
  goldBg: 'var(--flow-gold-bg, rgba(212,160,23,0.08))',
  blue: 'var(--flow-blue, #3b82f6)',
  blueBg: 'var(--flow-blue-bg, rgba(59,130,246,0.08))',
  green: 'var(--flow-green, #22c55e)',
  greenBg: 'var(--flow-green-bg, rgba(34,197,94,0.08))',
  purple: 'var(--flow-purple, #8b5cf6)',
  purpleBg: 'var(--flow-purple-bg, rgba(139,92,246,0.08))',
  fg: 'var(--flow-fg, #171a26)',
  muted: 'var(--flow-muted, #9ca3af)',
  border: 'var(--flow-border, rgba(0,0,0,0.10))',
  nodeBg: 'var(--flow-node-bg, #ffffff)',
};

/* ── Node positions ────────────────────────────────────────── */

const nodes = {
  rest:      { x: 130, y: 40,  w: 100, h: 38 },
  ws:        { x: 310, y: 40,  w: 100, h: 38 },
  cli:       { x: 490, y: 40,  w: 100, h: 38 },
  api:       { x: 260, y: 150, w: 200, h: 48 },
  scheduler: { x: 260, y: 260, w: 200, h: 48 },
  stt:       { x: 80,  y: 370, w: 180, h: 48 },
  tts:       { x: 460, y: 370, w: 180, h: 48 },
};

/* ── Paths (cubic beziers from node bottom → node top) ───── */

function pathDown(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): string {
  const cy1 = fromY + (toY - fromY) * 0.45;
  const cy2 = fromY + (toY - fromY) * 0.55;
  return `M${fromX},${fromY} C${fromX},${cy1} ${toX},${cy2} ${toX},${toY}`;
}

const cx = (n: (typeof nodes)[keyof typeof nodes]) => n.x + n.w / 2;
const bot = (n: (typeof nodes)[keyof typeof nodes]) => n.y + n.h;
const top = (n: (typeof nodes)[keyof typeof nodes]) => n.y;

const paths = {
  restToApi:     pathDown(cx(nodes.rest), bot(nodes.rest), cx(nodes.api), top(nodes.api)),
  wsToApi:       pathDown(cx(nodes.ws),   bot(nodes.ws),   cx(nodes.api), top(nodes.api)),
  cliToApi:      pathDown(cx(nodes.cli),  bot(nodes.cli),  cx(nodes.api), top(nodes.api)),
  apiToSched:    pathDown(cx(nodes.api),  bot(nodes.api),  cx(nodes.scheduler), top(nodes.scheduler)),
  schedToStt:    pathDown(cx(nodes.scheduler), bot(nodes.scheduler), cx(nodes.stt), top(nodes.stt)),
  schedToTts:    pathDown(cx(nodes.scheduler), bot(nodes.scheduler), cx(nodes.tts), top(nodes.tts)),
};

/* ── Animated dot along a path ─────────────────────────────── */

function FlowDot({
  path,
  color,
  dur,
  delay,
  size = 5,
}: {
  path: string;
  color: string;
  dur: number;
  delay: number;
  size?: number;
}) {
  return (
    <circle r={size} fill={color} opacity="0">
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        rotate="auto"
      />
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0"
        keyTimes="0;0.1;0.85;1"
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

/* ── Node rectangle ────────────────────────────────────────── */

function Node({
  x, y, w, h,
  label,
  sublabel,
  accent,
  pulse = false,
}: {
  x: number; y: number; w: number; h: number;
  label: string;
  sublabel?: string;
  accent: string;
  pulse?: boolean;
}) {
  return (
    <g>
      {pulse && (
        <rect
          x={x - 3}
          y={y - 3}
          width={w + 6}
          height={h + 6}
          rx={12}
          fill="none"
          stroke={accent}
          strokeWidth={1}
          opacity={0.3}
        >
          <animate
            attributeName="opacity"
            values="0.3;0.08;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={C.nodeBg}
        stroke={accent}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={sublabel ? y + h / 2 - 5 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C.fg}
        fontSize={12}
        fontWeight={600}
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={C.muted}
          fontSize={10}
          fontFamily="var(--font-inter), system-ui, sans-serif"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function RuntimeFlow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={VIEWBOX}
      className={`w-full ${className}`}
      aria-label="Macaw Runtime architecture flow diagram"
      role="img"
    >
      {/* ── Connection lines ──────────────────────────────── */}
      <g fill="none" strokeWidth={1.5} strokeLinecap="round">
        {/* Clients → API Server (gold) */}
        <path d={paths.restToApi}  stroke={C.gold}   opacity={0.25} />
        <path d={paths.wsToApi}    stroke={C.gold}   opacity={0.25} />
        <path d={paths.cliToApi}   stroke={C.gold}   opacity={0.25} />
        {/* API → Scheduler (purple) */}
        <path d={paths.apiToSched} stroke={C.purple}  opacity={0.25} />
        {/* Scheduler → Workers */}
        <path d={paths.schedToStt} stroke={C.blue}    opacity={0.25} />
        <path d={paths.schedToTts} stroke={C.green}   opacity={0.25} />
      </g>

      {/* ── Animated dots ─────────────────────────────────── */}
      <g>
        {/* Clients → API (gold dots, staggered) */}
        <FlowDot path={paths.restToApi} color={C.gold} dur={2.4} delay={0}   size={4} />
        <FlowDot path={paths.restToApi} color={C.gold} dur={2.4} delay={1.6} size={3} />
        <FlowDot path={paths.wsToApi}   color={C.gold} dur={2.0} delay={0.3} size={4} />
        <FlowDot path={paths.wsToApi}   color={C.gold} dur={2.0} delay={1.3} size={3} />
        <FlowDot path={paths.cliToApi}  color={C.gold} dur={2.6} delay={0.8} size={4} />

        {/* API → Scheduler (purple) */}
        <FlowDot path={paths.apiToSched} color={C.purple} dur={1.8} delay={0.5} size={4} />
        <FlowDot path={paths.apiToSched} color={C.purple} dur={1.8} delay={1.4} size={3} />

        {/* Scheduler → STT (blue) */}
        <FlowDot path={paths.schedToStt} color={C.blue} dur={2.0} delay={0.2} size={4} />
        <FlowDot path={paths.schedToStt} color={C.blue} dur={2.0} delay={1.2} size={3} />
        <FlowDot path={paths.schedToStt} color={C.blue} dur={2.0} delay={2.0} size={3} />

        {/* Scheduler → TTS (green) */}
        <FlowDot path={paths.schedToTts} color={C.green} dur={2.2} delay={0.6} size={4} />
        <FlowDot path={paths.schedToTts} color={C.green} dur={2.2} delay={1.7} size={3} />
      </g>

      {/* ── Nodes ─────────────────────────────────────────── */}

      {/* Clients */}
      <Node {...nodes.rest} label="REST"      accent={C.border} />
      <Node {...nodes.ws}   label="WebSocket"  accent={C.border} />
      <Node {...nodes.cli}  label="CLI"        accent={C.border} />

      {/* API Server */}
      <Node
        {...nodes.api}
        label="API Server"
        sublabel="FastAPI + Uvicorn"
        accent={C.gold}
        pulse
      />

      {/* Scheduler */}
      <Node
        {...nodes.scheduler}
        label="Scheduler"
        sublabel="Priority · Batching · TTFB"
        accent={C.purple}
        pulse
      />

      {/* Workers */}
      <Node
        {...nodes.stt}
        label="STT Workers"
        sublabel="Faster-Whisper · WeNet"
        accent={C.blue}
      />
      <Node
        {...nodes.tts}
        label="TTS Workers"
        sublabel="Kokoro"
        accent={C.green}
      />

      {/* ── Protocol labels on paths ─────────────────────── */}
      <text x={cx(nodes.api)} y={bot(nodes.api) + 18} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="var(--font-inter), system-ui, sans-serif">
        in-process
      </text>
      <text x={(cx(nodes.scheduler) + cx(nodes.stt)) / 2 - 15} y={bot(nodes.scheduler) + 35} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="var(--font-inter), system-ui, sans-serif">
        gRPC
      </text>
      <text x={(cx(nodes.scheduler) + cx(nodes.tts)) / 2 + 15} y={bot(nodes.scheduler) + 35} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="var(--font-inter), system-ui, sans-serif">
        gRPC
      </text>
    </svg>
  );
}
