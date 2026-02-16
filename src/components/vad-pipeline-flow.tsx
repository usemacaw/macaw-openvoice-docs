'use client';

/**
 * Animated SVG visualization of the VAD Pipeline.
 *
 * Vertical flow:
 *   Raw Audio → Resample → DC Remove → Gain Normalize
 *   → Energy Pre-filter → Silero VAD → VAD Decision
 *
 * Dots flow continuously from top to bottom,
 * changing color through preprocessing / gate / neural stages.
 */

const VIEWBOX = '0 0 480 540';

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
  input:    { x: 120, y: 10,  w: 200, h: 36 },
  resample: { x: 120, y: 78,  w: 200, h: 50 },
  dcRemove: { x: 120, y: 158, w: 200, h: 50 },
  gainNorm: { x: 120, y: 238, w: 200, h: 50 },
  energy:   { x: 120, y: 318, w: 200, h: 50 },
  silero:   { x: 120, y: 398, w: 200, h: 50 },
  decision: { x: 120, y: 486, w: 200, h: 36 },
};

const cx = (n: { x: number; w: number }) => n.x + n.w / 2;
const bot = (n: { y: number; h: number }) => n.y + n.h;

function pathDown(fy: number, ty: number): string {
  const x = cx(nodes.input); // all centered at same x
  const c1 = fy + (ty - fy) * 0.45;
  const c2 = fy + (ty - fy) * 0.55;
  return `M${x},${fy} C${x},${c1} ${x},${c2} ${x},${ty}`;
}

const paths = {
  inputToResample:    pathDown(bot(nodes.input), nodes.resample.y),
  resampleToDcRemove: pathDown(bot(nodes.resample), nodes.dcRemove.y),
  dcRemoveToGainNorm: pathDown(bot(nodes.dcRemove), nodes.gainNorm.y),
  gainNormToEnergy:   pathDown(bot(nodes.gainNorm), nodes.energy.y),
  energyToSilero:     pathDown(bot(nodes.energy), nodes.silero.y),
  sileroToDecision:   pathDown(bot(nodes.silero), nodes.decision.y),
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

export function VADPipelineFlow({ className = '' }: { className?: string }) {
  const timingX = nodes.input.x + nodes.input.w + 24;

  return (
    <svg viewBox={VIEWBOX} className={`w-full ${className}`} aria-label="VAD Pipeline flow diagram" role="img">
      {/* Stage group labels */}
      <rect x={100} y={72} width={240} height={240} rx={14} fill="none" stroke={C.blue} strokeWidth={1} strokeDasharray="5 4" opacity={0.15} />
      <text x={108} y={88} fill={C.blue} fontSize={9} fontWeight={600} opacity={0.5} fontFamily="var(--font-inter), system-ui, sans-serif">PREPROCESSING</text>

      <rect x={100} y={312} width={240} height={144} rx={14} fill="none" stroke={C.purple} strokeWidth={1} strokeDasharray="5 4" opacity={0.15} />
      <text x={108} y={328} fill={C.purple} fontSize={9} fontWeight={600} opacity={0.5} fontFamily="var(--font-inter), system-ui, sans-serif">DETECTION</text>

      {/* Connection lines */}
      <g fill="none" strokeWidth={1.5} strokeLinecap="round">
        <path d={paths.inputToResample} stroke={C.gold} opacity={0.25} />
        <path d={paths.resampleToDcRemove} stroke={C.blue} opacity={0.25} />
        <path d={paths.dcRemoveToGainNorm} stroke={C.blue} opacity={0.25} />
        <path d={paths.gainNormToEnergy} stroke={C.purple} opacity={0.25} />
        <path d={paths.energyToSilero} stroke={C.purple} opacity={0.25} />
        <path d={paths.sileroToDecision} stroke={C.green} opacity={0.25} />
      </g>

      {/* Animated dots — staggered to create continuous stream */}
      <g>
        {/* Input → Resample */}
        <FlowDot path={paths.inputToResample} color={C.gold} dur={1.2} delay={0} size={4} />
        <FlowDot path={paths.inputToResample} color={C.gold} dur={1.2} delay={0.7} size={3} />

        {/* Preprocessing stages (blue) */}
        <FlowDot path={paths.resampleToDcRemove} color={C.blue} dur={1.4} delay={0.3} size={4} />
        <FlowDot path={paths.resampleToDcRemove} color={C.blue} dur={1.4} delay={1.0} size={3} />

        <FlowDot path={paths.dcRemoveToGainNorm} color={C.blue} dur={1.4} delay={0.6} size={4} />
        <FlowDot path={paths.dcRemoveToGainNorm} color={C.blue} dur={1.4} delay={1.3} size={3} />

        {/* Gate + VAD stages (purple) */}
        <FlowDot path={paths.gainNormToEnergy} color={C.purple} dur={1.4} delay={0.9} size={4} />
        <FlowDot path={paths.gainNormToEnergy} color={C.purple} dur={1.4} delay={1.6} size={3} />

        <FlowDot path={paths.energyToSilero} color={C.purple} dur={1.6} delay={1.2} size={4} />

        {/* Output (green) */}
        <FlowDot path={paths.sileroToDecision} color={C.green} dur={1.4} delay={1.5} size={4} />
        <FlowDot path={paths.sileroToDecision} color={C.green} dur={1.4} delay={2.2} size={3} />
      </g>

      {/* Nodes */}
      <Node {...nodes.input} label="Raw Audio Input" accent={C.gold} />
      <Node {...nodes.resample} label="Resample" sublabel="16kHz mono · polyphase" accent={C.blue} />
      <Node {...nodes.dcRemove} label="DC Remove" sublabel="Butterworth HPF @ 20Hz" accent={C.blue} />
      <Node {...nodes.gainNorm} label="Gain Normalize" sublabel="Peak normalize to -3 dBFS" accent={C.blue} />
      <Node {...nodes.energy} label="Energy Pre-filter" sublabel="RMS + spectral flatness gate" accent={C.purple} pulse />
      <Node {...nodes.silero} label="Silero VAD" sublabel="Neural speech probability" accent={C.green} pulse />
      <Node {...nodes.decision} label="VAD Decision" accent={C.gold} />

      {/* Timing annotations */}
      <g fill={C.muted} fontSize={9.5} fontFamily="var(--font-mono), monospace">
        <text x={timingX} y={nodes.resample.y + nodes.resample.h / 2 + 1} dominantBaseline="middle">~0.5 ms</text>
        <text x={timingX} y={nodes.dcRemove.y + nodes.dcRemove.h / 2 + 1} dominantBaseline="middle">~0.1 ms</text>
        <text x={timingX} y={nodes.gainNorm.y + nodes.gainNorm.h / 2 + 1} dominantBaseline="middle">~0.1 ms</text>
        <text x={timingX} y={nodes.energy.y + nodes.energy.h / 2 + 1} dominantBaseline="middle">~0.1 ms</text>
        <text x={timingX} y={nodes.silero.y + nodes.silero.h / 2 + 1} dominantBaseline="middle">~2.0 ms</text>
      </g>

      {/* Conditional annotation at energy pre-filter */}
      <text x={nodes.energy.x - 8} y={nodes.energy.y + nodes.energy.h / 2 + 1} textAnchor="end" dominantBaseline="middle" fill={C.muted} fontSize={8.5} fontStyle="italic" fontFamily="var(--font-inter), system-ui, sans-serif">skip if silent</text>
    </svg>
  );
}
