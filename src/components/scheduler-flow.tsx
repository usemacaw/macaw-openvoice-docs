'use client';

/**
 * Animated SVG visualization of the Scheduler architecture.
 *
 * Layout:
 *   [REST Request]
 *        |
 *   ┌─ Scheduler ─────────────────────────┐
 *   │ [BatchAccumulator] → [PriorityQueue] │
 *   │ [CancellationMgr]   [Dispatch Loop]  │
 *   │            [LatencyTracker]           │
 *   └─────────────────────────────────────-┘
 *        |
 *   [gRPC Workers]
 */

const VIEWBOX = '0 0 660 510';

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
  input:    { x: 250, y: 15,  w: 160, h: 38 },
  batch:    { x: 85,  y: 118, w: 200, h: 52 },
  queue:    { x: 375, y: 118, w: 200, h: 52 },
  cancel:   { x: 85,  y: 240, w: 200, h: 52 },
  dispatch: { x: 375, y: 240, w: 200, h: 52 },
  latency:  { x: 225, y: 345, w: 200, h: 48 },
  output:   { x: 250, y: 448, w: 160, h: 38 },
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
  inputToBatch: pathDown(cx(nodes.input), bot(nodes.input), cx(nodes.batch), nodes.batch.y),
  batchToQueue: `M${nodes.batch.x + nodes.batch.w},${cy(nodes.batch)} Q${(nodes.batch.x + nodes.batch.w + nodes.queue.x) / 2},${cy(nodes.batch) - 12} ${nodes.queue.x},${cy(nodes.queue)}`,
  queueToDispatch: pathDown(cx(nodes.queue), bot(nodes.queue), cx(nodes.dispatch), nodes.dispatch.y),
  dispatchToOutput: pathDown(cx(nodes.dispatch), bot(nodes.dispatch), cx(nodes.output), nodes.output.y),
  dispatchToLatency: pathDown(cx(nodes.dispatch) - 40, bot(nodes.dispatch), cx(nodes.latency), nodes.latency.y),
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

function Node({ x, y, w, h, label, sublabel, accent, pulse = false }: {
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string; accent: string; pulse?: boolean;
}) {
  return (
    <g>
      {pulse && (
        <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={12} fill="none" stroke={accent} strokeWidth={1} opacity={0.3}>
          <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
        </rect>
      )}
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.nodeBg} stroke={accent} strokeWidth={1.5} />
      <text x={x + w / 2} y={sublabel ? y + h / 2 - 6 : y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={C.fg} fontSize={12} fontWeight={600} fontFamily="var(--font-inter), system-ui, sans-serif">{label}</text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" dominantBaseline="middle" fill={C.muted} fontSize={9.5} fontFamily="var(--font-inter), system-ui, sans-serif">{sublabel}</text>
      )}
    </g>
  );
}

export function SchedulerFlow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={VIEWBOX} className={`w-full ${className}`} aria-label="Scheduler architecture flow diagram" role="img">
      {/* Scheduler bounding box */}
      <rect x={55} y={85} width={550} height={320} rx={16} fill="none" stroke={C.border} strokeWidth={1.5} strokeDasharray="6 4" />
      <text x={330} y={103} textAnchor="middle" fill={C.muted} fontSize={11} fontWeight={600} fontFamily="var(--font-inter), system-ui, sans-serif">SCHEDULER</text>

      {/* Connection lines */}
      <g fill="none" strokeWidth={1.5} strokeLinecap="round">
        <path d={paths.inputToBatch} stroke={C.gold} opacity={0.25} />
        <path d={paths.batchToQueue} stroke={C.blue} opacity={0.25} />
        <path d={paths.queueToDispatch} stroke={C.purple} opacity={0.25} />
        <path d={paths.dispatchToOutput} stroke={C.green} opacity={0.25} />
        <path d={paths.dispatchToLatency} stroke={C.muted} opacity={0.15} strokeDasharray="4 3" />
      </g>

      {/* Animated dots */}
      <g>
        <FlowDot path={paths.inputToBatch} color={C.gold} dur={2.2} delay={0} size={4} />
        <FlowDot path={paths.inputToBatch} color={C.gold} dur={2.2} delay={1.5} size={3} />
        <FlowDot path={paths.batchToQueue} color={C.blue} dur={1.4} delay={0.4} size={4} />
        <FlowDot path={paths.batchToQueue} color={C.blue} dur={1.4} delay={1.1} size={3} />
        <FlowDot path={paths.queueToDispatch} color={C.purple} dur={1.6} delay={0.2} size={4} />
        <FlowDot path={paths.queueToDispatch} color={C.purple} dur={1.6} delay={1.0} size={3} />
        <FlowDot path={paths.dispatchToOutput} color={C.green} dur={2.4} delay={0.6} size={4} />
        <FlowDot path={paths.dispatchToOutput} color={C.green} dur={2.4} delay={1.7} size={3} />
      </g>

      {/* Nodes */}
      <Node {...nodes.input} label="REST Request" accent={C.gold} />
      <Node {...nodes.batch} label="BatchAccumulator" sublabel="Group by model · 50ms / 8" accent={C.blue} pulse />
      <Node {...nodes.queue} label="PriorityQueue" sublabel="REALTIME first · FIFO" accent={C.purple} pulse />
      <Node {...nodes.cancel} label="CancellationMgr" sublabel="Queue + in-flight · gRPC Cancel" accent={C.border} />
      <Node {...nodes.dispatch} label="Dispatch Loop" sublabel="gRPC channel pool" accent={C.green} pulse />
      <Node {...nodes.latency} label="LatencyTracker" sublabel="4 phases · 60s TTL" accent={C.border} />
      <Node {...nodes.output} label="gRPC Workers" accent={C.green} />

      {/* Path labels */}
      <text x={(nodes.batch.x + nodes.batch.w + nodes.queue.x) / 2} y={cy(nodes.batch) - 18} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="var(--font-inter), system-ui, sans-serif">batch</text>
      <text x={cx(nodes.queue) + 15} y={bot(nodes.queue) + 16} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="var(--font-inter), system-ui, sans-serif">dequeue</text>
    </svg>
  );
}
