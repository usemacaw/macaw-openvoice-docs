import Link from 'next/link';
import {
  Mic,
  Volume2,
  ArrowLeftRight,
  ShieldCheck,
  Cog,
  Workflow,
  Check,
  ArrowRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { RuntimeFlow } from '@/components/runtime-flow';

/* ── Shared components ─────────────────────────────────────── */

function WindowChrome({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-medium text-fd-muted-foreground">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Prompt() {
  return <span className="select-none text-fd-primary">$ </span>;
}

function Cmd({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-fd-foreground">{children}</span>;
}

function Dim({ children }: { children: ReactNode }) {
  return <span className="text-fd-muted-foreground">{children}</span>;
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-[#cf222e] dark:text-[#ff7b72]">{children}</span>;
}

function Fn({ children }: { children: ReactNode }) {
  return (
    <span className="text-[#8250df] dark:text-[#d2a8ff]">{children}</span>
  );
}

function Str({ children }: { children: ReactNode }) {
  return (
    <span className="text-[#0a3069] dark:text-[#a5d6ff]">{children}</span>
  );
}

function Comment({ children }: { children: ReactNode }) {
  return (
    <span className="italic text-fd-muted-foreground">{children}</span>
  );
}

/* ── Data ──────────────────────────────────────────────────── */

const features: { title: string; icon: ReactNode; description: string }[] = [
  {
    title: 'Streaming STT',
    icon: <Mic className="size-6" />,
    description:
      'Real-time partial and final transcripts via WebSocket with sub-300ms TTFB and backpressure control.',
  },
  {
    title: 'Text-to-Speech',
    icon: <Volume2 className="size-6" />,
    description:
      'OpenAI-compatible speech endpoint with streaming PCM or WAV output and low time-to-first-byte.',
  },
  {
    title: 'Full-Duplex',
    icon: <ArrowLeftRight className="size-6" />,
    description:
      'Simultaneous STT and TTS on one WebSocket connection with automatic mute-on-speak safety.',
  },
  {
    title: 'Session Manager',
    icon: <ShieldCheck className="size-6" />,
    description:
      '6-state machine with ring buffer, WAL-based crash recovery, and zero segment duplication.',
  },
  {
    title: 'Multi-Engine',
    icon: <Cog className="size-6" />,
    description:
      'Faster-Whisper, WeNet, and Kokoro through a single interface. Add new engines in ~500 lines.',
  },
  {
    title: 'Voice Pipeline',
    icon: <Workflow className="size-6" />,
    description:
      'Preprocessing, Silero VAD, ITN post-processing, and Prometheus metrics — all built in.',
  },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-fd-border bg-fd-background py-20 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-start lg:gap-16">
          {/* Copy */}
          <div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-fd-muted-foreground">
              Open-Source Voice Runtime
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl lg:text-6xl">
              Build voice apps{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                in minutes,
              </span>{' '}
              not months
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-fd-muted-foreground">
              Macaw OpenVoice is a production-ready runtime for real-time
              speech-to-text and text-to-speech. Drop-in OpenAI API
              compatibility, streaming WebSocket support, and multi-engine
              architecture &mdash; all in a single Python process.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/docs/getting-started/quickstart"
                className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/docs"
                className="rounded-lg border border-fd-border px-6 py-3 text-sm font-semibold text-fd-foreground transition hover:bg-fd-muted"
              >
                Read the Docs
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Python 3.11+', 'Apache 2.0', '1600+ tests'].map((badge) => (
                <span
                  key={badge}
                  className="rounded-md bg-fd-muted px-3 py-1 text-xs font-medium text-fd-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal — interactive session */}
          <WindowChrome label="terminal" className="w-full max-w-lg">
            <div className="overflow-x-auto bg-[#fafafa] p-4 font-mono text-[13px] leading-[1.7] dark:bg-[#161b22]">
              {/* Step 1: Install */}
              <div>
                <Prompt /><Cmd>pip install</Cmd>{' '}
                <Dim>macaw-openvoice[server,grpc,faster-whisper]</Dim>
              </div>
              <div className="text-fd-muted-foreground">
                Successfully installed macaw-openvoice-1.0.0
              </div>
              <div className="mt-3">
                <Prompt /><Cmd>macaw serve</Cmd>
              </div>

              {/* Step 2: Server boot */}
              <div className="my-2 rounded-md border border-fd-primary/20 bg-fd-primary/5 px-3 py-2 text-[12px]">
                <div className="font-bold text-fd-primary">
                  Macaw OpenVoice v1.0.0
                </div>
                <div className="mt-1 space-y-0.5 text-fd-muted-foreground">
                  <div>
                    <span className="text-green-600 dark:text-green-400">INFO </span>
                    Found 2 model(s)
                  </div>
                  <div>
                    <span className="text-green-600 dark:text-green-400">INFO </span>
                    STT worker ready &nbsp;port=50051
                  </div>
                  <div>
                    <span className="text-green-600 dark:text-green-400">INFO </span>
                    TTS worker ready &nbsp;port=50052
                  </div>
                  <div>
                    <span className="text-green-600 dark:text-green-400">INFO </span>
                    Uvicorn running on{' '}
                    <span className="text-fd-foreground">
                      http://127.0.0.1:8000
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Transcription request */}
              <div>
                <Prompt /><Cmd>curl</Cmd>{' '}
                <Dim>-X POST localhost:8000/v1/audio/transcriptions \</Dim>
              </div>
              <div className="pl-5">
                <Dim>-F file=@audio.wav -F model=faster-whisper-tiny</Dim>
              </div>

              {/* Step 4: JSON response */}
              <div className="mt-2 rounded-md border border-fd-border bg-fd-card px-3 py-2">
                <span className="text-fd-muted-foreground">{'{'}</span>
                <Str>{'"text"'}</Str>
                <span className="text-fd-muted-foreground">: </span>
                <Str>{'"Hello, how can I help you today?"'}</Str>
                <span className="text-fd-muted-foreground">{'}'}</span>
              </div>

              {/* Blinking cursor */}
              <div className="mt-2">
                <Prompt />
                <span className="inline-block h-4 w-1.5 animate-pulse bg-fd-foreground/70" />
              </div>
            </div>
          </WindowChrome>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="bg-fd-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-fd-foreground">
              Everything you need for voice
            </h2>
            <p className="mt-4 text-lg text-fd-muted-foreground">
              A single runtime that handles the entire voice pipeline &mdash;
              from raw audio to structured text and back.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-fd-border bg-fd-card p-6 transition hover:shadow-md"
              >
                <div className="mb-3 text-fd-primary">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-fd-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-fd-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OpenAI SDK Compatible ───────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
            <div className="max-w-md lg:py-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fd-primary">
                Drop-in Replacement
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-fd-foreground">
                OpenAI SDK compatible
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fd-muted-foreground">
                Existing OpenAI client libraries work out of the box. Change
                one line and your code talks to Macaw instead.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  '/v1/audio/transcriptions',
                  '/v1/audio/speech',
                  '/v1/audio/translations',
                ].map((endpoint) => (
                  <li key={endpoint} className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-fd-primary" />
                    <code className="text-sm text-fd-foreground">
                      {endpoint}
                    </code>
                  </li>
                ))}
              </ul>
              <Link
                href="/docs/api-reference/rest-api"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
              >
                API Reference
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <WindowChrome label="app.py" className="w-full max-w-lg">
              <div className="overflow-x-auto bg-[#fafafa] p-4 font-mono text-[13px] leading-[1.7] dark:bg-[#161b22]">
                {/* Line numbers + code */}
                <table className="w-full border-collapse border-none">
                  <tbody>
                    {[
                      <><Kw>from</Kw> openai <Kw>import</Kw> OpenAI</>,
                      null,
                      <>client = <Fn>OpenAI</Fn>(</>,
                      { highlight: true, content: <>&nbsp;&nbsp;&nbsp;&nbsp;base_url=<Str>"http://localhost:8000/v1"</Str>,</> },
                      <>&nbsp;&nbsp;&nbsp;&nbsp;api_key=<Str>"not-needed"</Str></>,
                      <>)</>,
                      null,
                      <>result = client.audio.transcriptions.<Fn>create</Fn>(</>,
                      <>&nbsp;&nbsp;&nbsp;&nbsp;model=<Str>"faster-whisper-tiny"</Str>,</>,
                      <>&nbsp;&nbsp;&nbsp;&nbsp;file=<Fn>open</Fn>(<Str>"audio.wav"</Str>, <Str>"rb"</Str>),</>,
                      <>)</>,
                      <><Fn>print</Fn>(result.text)</>,
                    ].map((line, i) => {
                      const isHighlight = typeof line === 'object' && line !== null && 'highlight' in line;
                      const content = isHighlight ? (line as { highlight: boolean; content: ReactNode }).content : line;
                      return (
                        <tr
                          key={i}
                          className={
                            isHighlight
                              ? 'bg-fd-primary/10'
                              : ''
                          }
                        >
                          <td className="w-8 select-none pr-3 text-right align-top text-fd-muted-foreground/50">
                            {i + 1}
                          </td>
                          <td className="text-fd-foreground">
                            {content ?? '\u00A0'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-2 border-t border-fd-border pt-2">
                  <Comment># Only base_url changes — everything else stays the same</Comment>
                </div>
              </div>
            </WindowChrome>
          </div>
        </div>
      </section>

      {/* ── Architecture ────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fd-primary">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-fd-foreground">
              Architecture at a glance
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-fd-muted-foreground">
              A single runtime orchestrates isolated gRPC workers per engine.
              Workers crash independently &mdash; the runtime recovers
              automatically.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-fd-border bg-fd-card p-6 shadow-lg sm:p-10">
            <RuntimeFlow />
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-fd-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--flow-gold)' }} />
              Clients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--flow-purple)' }} />
              Orchestration
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--flow-blue)' }} />
              STT
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--flow-green)' }} />
              TTS
            </span>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/docs/architecture/overview"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
            >
              Read the full architecture guide
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-fd-border bg-fd-muted py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
              Learn
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-fd-foreground hover:underline">Welcome</Link></li>
              <li><Link href="/docs/getting-started/quickstart" className="text-fd-foreground hover:underline">Quickstart</Link></li>
              <li><Link href="/docs/getting-started/installation" className="text-fd-foreground hover:underline">Installation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
              Guides
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs/guides/streaming-stt" className="text-fd-foreground hover:underline">Streaming STT</Link></li>
              <li><Link href="/docs/guides/full-duplex" className="text-fd-foreground hover:underline">Full-Duplex</Link></li>
              <li><Link href="/docs/guides/adding-engine" className="text-fd-foreground hover:underline">Adding an Engine</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
              Reference
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs/api-reference/rest-api" className="text-fd-foreground hover:underline">REST API</Link></li>
              <li><Link href="/docs/api-reference/websocket-protocol" className="text-fd-foreground hover:underline">WebSocket Protocol</Link></li>
              <li><Link href="/docs/architecture/overview" className="text-fd-foreground hover:underline">Architecture</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fd-muted-foreground">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://usemacaw.io" className="text-fd-foreground hover:underline">Website</a></li>
              <li><a href="https://github.com/usemacaw/macaw-openvoice" className="text-fd-foreground hover:underline">GitHub</a></li>
              <li><a href="mailto:hello@usemacaw.io" className="text-fd-foreground hover:underline">Email</a></li>
              <li><Link href="/docs/community/contributing" className="text-fd-foreground hover:underline">Contributing</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-fd-border px-6 pt-6 text-center text-xs text-fd-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} Macaw Team. Apache 2.0
          License.
        </div>
      </footer>
    </>
  );
}
