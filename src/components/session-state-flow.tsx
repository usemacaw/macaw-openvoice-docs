'use client';

/**
 * Animated SVG visualization of the Session Manager state machine.
 *
 * States: INIT → ACTIVE ↔ SILENCE → HOLD → CLOSING → CLOSED
 *
 * The ACTIVE ↔ SILENCE cycle is the main operating loop.
 * HOLD loops back to ACTIVE on speech_start (top arc).
 * SILENCE loops back to ACTIVE on speech_start (bottom arc).
 */

const VIEWBOX = '0 0 680 310';

const C = {
  gold: 'var(--flow-gold, #d4a017)',
  blue: 'var(--flow-blue, #3b82f6)',
  green: 'var(--flow-green, #22c55e)',
  purple: 'var(--flow-purple, #8b5cf6)',
  fg: 'var(--flow-fg, #171a26)',
  muted: 'var(--flow-muted, #9ca3af)',
  border: 'var(--flow-border, rgba(0,0,0,0.10))',
  nodeBg: 'var(--flow-node-bg, #ffffff)',
};

const nodes = {
  init:    { x: 30,  y: 65, w: 120, h: 44 },
  active:  { x: 190, y: 65, w: 120, h: 44 },
  silence: { x: 350, y: 65, w: 120, h: 44 },
  hold:    { x: 510, y: 65, w: 120, h: 44 },
  closing: { x: 430, y: 185, w: 120, h: 44 },
  closed:  { x: 190, y: 260, w: 300, h: 44 },
};

const cx = (n: { x: number; w: number }) => n.x + n.w / 2;
const cy = (n: { y: number; h: number }) => n.y + n.h / 2;
const bot = (n: { y: number; h: number }) => n.y + n.h;

function pathDown(fx: number, fy: number, tx: number, ty: number): string {
  const c1 = fy + (ty - fy) * 0.45;
  const c2 = fy + (ty - fy) * 0.55;
  return `M${fx},${fy} C${fx},${c1} ${tx},${c2} ${tx},${ty}`;
}

const paths = {
  // Forward transitions (left to right)
  initToActive:    `M${nodes.init.x + nodes.init.w},${cy(nodes.init)} Q${(nodes.init.x + nodes.init.w + nodes.active.x) / 2},${cy(nodes.init) - 8} ${nodes.active.x},${cy(nodes.active)}`,
  activeToSilence: `M${nodes.active.x + nodes.active.w},${cy(nodes.active)} Q${(nodes.active.x + nodes.active.w + nodes.silence.x) / 2},${cy(nodes.active) - 8} ${nodes.silence.x},${cy(nodes.silence)}`,
  silenceToHold:   `M${nodes.silence.x + nodes.silence.w},${cy(nodes.silence)} Q${(nodes.silence.x + nodes.silence.w + nodes.hold.x) / 2},${cy(nodes.silence) - 8} ${nodes.hold.x},${cy(nodes.hold)}`,

  // Back arcs (speech resumes)
  holdToActive:    `M${cx(nodes.hold)},${nodes.hold.y} C${cx(nodes.hold)},15 ${cx(nodes.active)},15 ${cx(nodes.active)},${nodes.active.y}`,
  silenceToActive: `M${cx(nodes.silence)},${bot(nodes.silence)} C${cx(nodes.silence)},152 ${cx(nodes.active)},152 ${cx(nodes.active)},${bot(nodes.active)}`,

  // Down to closing/closed
  holdToClosing:    pathDown(cx(nodes.hold), bot(nodes.hold), cx(nodes.closing), nodes.closing.y),
  closingToClosed:  pathDown(cx(nodes.closing), bot(nodes.closing), cx(nodes.closed), nodes.closed.y),
};

function FlowDot({ path, color, dur, delay, size = 4 }: {
  path: string; color: string; dur: number; delay: number; size?: number;
}) {
  return (
    <circle r={size} fill={color} opacity="0">
      <animateMotion path={path} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" rotate="auto" />
      <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

function StateNode({ x, y, w, h, label, accent, pulse = false }: {
  x: number; y: number; w: number; h: number;
  label: string; accent: string; pulse?: boolean;
}) {
  return (
    <g>
      {pulse && (
        <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={14} fill="none" stroke={accent} strokeWidth={1} opacity={0.3}>
          <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
        </rect>
      )}
      <rect x={x} y={y} width={w} height={h} rx={12} fill={C.nodeBg} stroke={accent} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={C.fg} fontSize={12} fontWeight={600} fontFamily="var(--font-inter), system-ui, sans-serif">{label}</text>
    </g>
  );
}

export function SessionStateFlow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={VIEWBOX} className={`w-full ${className}`} aria-label="Session Manager state machine diagram" role="img">
      {/* Connection lines */}
      <g fill="none" strokeWidth={1.5} strokeLinecap="round">
        {/* Forward (left to right) */}
        <path d={paths.initToActive} stroke={C.gold} opacity={0.25} />
        <path d={paths.activeToSilence} stroke={C.blue} opacity={0.25} />
        <path d={paths.silenceToHold} stroke={C.purple} opacity={0.25} />

        {/* Back arcs */}
        <path d={paths.holdToActive} stroke={C.gold} opacity={0.2} />
        <path d={paths.silenceToActive} stroke={C.green} opacity={0.2} />

        {/* Down to terminal */}
        <path d={paths.holdToClosing} stroke={C.purple} opacity={0.25} />
        <path d={paths.closingToClosed} stroke={C.muted} opacity={0.2} />
      </g>

      {/* Animated dots */}
      <g>
        {/* INIT → ACTIVE (speech start) */}
        <FlowDot path={paths.initToActive} color={C.gold} dur={2.0} delay={0} size={4} />

        {/* ACTIVE → SILENCE (speech end) */}
        <FlowDot path={paths.activeToSilence} color={C.blue} dur={1.8} delay={0.3} size={4} />
        <FlowDot path={paths.activeToSilence} color={C.blue} dur={1.8} delay={1.2} size={3} />

        {/* SILENCE → ACTIVE (speech resumes — bottom arc) */}
        <FlowDot path={paths.silenceToActive} color={C.green} dur={2.2} delay={0.6} size={4} />
        <FlowDot path={paths.silenceToActive} color={C.green} dur={2.2} delay={1.7} size={3} />

        {/* SILENCE → HOLD (timeout) */}
        <FlowDot path={paths.silenceToHold} color={C.purple} dur={2.4} delay={1.0} size={3} />

        {/* HOLD → ACTIVE (speech resumes — top arc) */}
        <FlowDot path={paths.holdToActive} color={C.gold} dur={2.8} delay={0.8} size={4} />

        {/* HOLD → CLOSING (timeout) */}
        <FlowDot path={paths.holdToClosing} color={C.purple} dur={1.6} delay={1.5} size={3} />

        {/* CLOSING → CLOSED */}
        <FlowDot path={paths.closingToClosed} color={C.muted} dur={1.4} delay={2.0} size={3} />
      </g>

      {/* State nodes */}
      <StateNode {...nodes.init} label="INIT" accent={C.border} />
      <StateNode {...nodes.active} label="ACTIVE" accent={C.green} pulse />
      <StateNode {...nodes.silence} label="SILENCE" accent={C.blue} pulse />
      <StateNode {...nodes.hold} label="HOLD" accent={C.purple} />
      <StateNode {...nodes.closing} label="CLOSING" accent={C.gold} />
      <StateNode {...nodes.closed} label="CLOSED" accent={C.border} />

      {/* Transition labels */}
      <text x={(nodes.init.x + nodes.init.w + nodes.active.x) / 2} y={cy(nodes.init) - 14} textAnchor="middle" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">speech_start</text>
      <text x={(nodes.active.x + nodes.active.w + nodes.silence.x) / 2} y={cy(nodes.active) - 14} textAnchor="middle" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">speech_end</text>
      <text x={(nodes.silence.x + nodes.silence.w + nodes.hold.x) / 2} y={cy(nodes.silence) - 14} textAnchor="middle" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">timeout</text>

      {/* Top arc label */}
      <text x={(cx(nodes.hold) + cx(nodes.active)) / 2} y={10} textAnchor="middle" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">speech_start</text>

      {/* Bottom arc label */}
      <text x={(cx(nodes.silence) + cx(nodes.active)) / 2} y={160} textAnchor="middle" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">speech_start</text>

      {/* Down labels */}
      <text x={cx(nodes.hold) + 22} y={(bot(nodes.hold) + nodes.closing.y) / 2 + 2} textAnchor="start" fill={C.muted} fontSize={8.5} fontFamily="var(--font-inter), system-ui, sans-serif">timeout</text>
    </svg>
  );
}
