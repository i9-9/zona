"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LangToggle } from "@/components/LangToggle";

type BootCtx = {
  armed1: number;
  armed2: number;
  corrOn: boolean;
  unit3: number;
  resA: number;
  resB: number;
  resU: number;
  temp: number;
  gridCtl: string;
  voidSt: string;
  signal: string;
  gridNodes: string;
  topoCache: string;
  rfGrid: string;
};

type BootStep = {
  col: "left" | "right";
  delay: number;
  className?: string;
  text?: string;
  typeSpeed?: number;
  effect?: "corr" | "armed" | "units" | "diag";
  render?: (ctx: BootCtx) => React.ReactNode;
};

type StatusRow = { label: string; val: string; cls: "pass" | "fail" | "null" };

const POST_COLD: StatusRow[] = [
  { label: "TOPO ENGINE v2.6", val: "OFFLINE", cls: "null" },
  { label: "HALFTONE BUS 0.00MHZ", val: "STBY", cls: "null" },
  { label: "MEM MAP 00064MB", val: "PASS", cls: "pass" },
  { label: "ZONE MATRIX INIT", val: "FAIL", cls: "fail" },
  { label: "CRC TOPO.DAT", val: "PASS", cls: "pass" },
  { label: "RF LINK 243.0MHZ", val: "NULL", cls: "null" },
  { label: "AUX PWR BUS", val: "0.00V", cls: "null" },
];

const POST_WARM: StatusRow[] = [
  { label: "TOPO ENGINE v2.6", val: "ONLINE", cls: "pass" },
  { label: "HALFTONE BUS 0.00MHZ", val: "READY", cls: "pass" },
  { label: "MEM MAP 00064MB", val: "PASS", cls: "pass" },
  { label: "ZONE MATRIX INIT", val: "FAIL", cls: "fail" },
  { label: "CRC TOPO.DAT", val: "PASS", cls: "pass" },
  { label: "RF LINK 243.0MHZ", val: "SYNC", cls: "pass" },
  { label: "AUX PWR BUS", val: "12.4V", cls: "pass" },
];

const RF_CHANNELS = [
  { freq: "121.5MHz", role: "VHF GUARD", note: "CABA AIR" },
  { freq: "243.0MHz", role: "UHF MESH", note: "GRID SYNC" },
  { freq: "482.2MHz", role: "ZONA BC", note: "HOME NODE" },
  { freq: "3.2GHz", role: "BEACON", note: "IDENT TX" },
  { freq: "8.8GHz", role: "GZ-LINK", note: "PRIMARY" },
  { freq: "9.4GHz", role: "ELINT", note: "NOISE FLT" },
  { freq: "15.2GHz", role: "TOPO TX", note: "MAP OUT" },
] as const;

const GRIDSYS_ROWS = [
  { cell: "PALERMO N", state: "SYNC", tri: "▲▲▲" },
  { cell: "RECOLETA", state: "SYNC", tri: "▲▲▲" },
  { cell: "LA BOCA W", state: "WEAK", tri: "△△△" },
  { cell: "UHF 243.0 TX 16.8W", state: "", tri: "▲▲▲" },
  { cell: "ELINT 9.4GHZ GAIN 42", state: "", tri: "▲▲▲" },
  { cell: "RF-GRID LINK", state: "UP", tri: "▲▲▲" },
] as const;

const ZONE_MAP = [
  { id: "01", zone: "ZONE-W", route: "EROSION", sig: "[●●—]" },
  { id: "02", zone: "ZONE-N", route: "INFRA", sig: "[●—●]" },
  { id: "03", zone: "ZONE-E", route: "SPECTRO", sig: "[—●●]" },
  { id: "04", zone: "ZONE-S", route: "VOID", sig: "[●○—]" },
  { id: "05", zone: "ZONE-C", route: "CORE", sig: "[○●●]" },
] as const;

const RWR_CONTACTS = [
  { id: "Z0", brg: "000", freq: "482.2MHZ", type: "ZONA-HOME" },
  { id: "C4", brg: "310", freq: "8.8GHZ", type: "GROUND-ZERO" },
  { id: "G1", brg: "047", freq: "9.4GHZ", type: "NOISE-FLOOR" },
] as const;

const GRID_NODES = [
  { brg: "045°", dist: "2.1NM", id: "OBS-N", offset: "OBELISCO" },
  { brg: "315°", dist: "4.8NM", id: "PAL-N", offset: "PALERMO" },
  { brg: "135°", dist: "3.2NM", id: "BOC-W", offset: "LA BOCA" },
  { brg: "225°", dist: "6.1NM", id: "FLO-S", offset: "FLORES" },
] as const;

function statusLine(row: StatusRow) {
  const dots = ".".repeat(Math.max(1, 28 - row.label.length));
  return (
    <div className="boot-status-line">
      <span className="boot-status-label">{row.label}</span>
      <span>{dots}</span>
      <span className={`boot-status-val ${row.cls}`}>{row.val}</span>
    </div>
  );
}

function buildSequence(): BootStep[] {
  const seq: BootStep[] = [
    { col: "left", delay: 0, className: "boot-corp", text: "ZONA Systems Corp.", typeSpeed: 18 },
    { col: "left", delay: 90, text: "GZ-01™ Ground Zero Sequence", typeSpeed: 14 },
    { col: "left", delay: 70, text: "FW 26.0 / BUILD GODLESS", typeSpeed: 16 },
    { col: "left", delay: 70, text: "NODE: BUENOS AIRES  34.60°S 58.38°W", typeSpeed: 10 },
    { col: "left", delay: 180, text: "" },
    { col: "right", delay: 40, className: "boot-section-title boot-section-left", text: "RF SPECTRUM SCAN", typeSpeed: 12 },
  ];

  for (const ch of RF_CHANNELS.slice(0, 3)) {
    seq.push({
      col: "right",
      delay: 60,
      className: "boot-freq-line",
      text: `${ch.freq}  ${ch.role}  ${ch.note}`,
      typeSpeed: 9,
    });
  }

  for (const row of POST_COLD) {
    seq.push({
      col: "left",
      delay: row.cls === "fail" ? 220 : 95,
      render: () => statusLine(row),
    });
  }

  seq.push({ col: "left", delay: 140, text: "" });

  for (const ch of RF_CHANNELS.slice(3)) {
    seq.push({
      col: "right",
      delay: 55,
      className: "boot-freq-line",
      text: `${ch.freq}  ${ch.role}  ${ch.note}`,
      typeSpeed: 9,
    });
  }

  seq.push(
    { col: "right", delay: 120, text: "" },
    { col: "right", delay: 80, className: "boot-radar-line", text: "SWEEP: CABA METRO  24KM RAD", typeSpeed: 10 },
    { col: "right", delay: 70, className: "boot-radar-line", text: "PRF 1.2K   AZ SLEW 24   RES 15M", typeSpeed: 10 },
    { col: "left", delay: 100, className: "boot-diag-line", text: ">> GRIDSYS HANDSHAKE...", typeSpeed: 12 },
  );

  for (const row of POST_WARM) {
    seq.push({
      col: "left",
      delay: row.cls === "fail" ? 180 : 85,
      render: () => statusLine(row),
    });
  }

  seq.push(
    { col: "left", delay: 160, className: "boot-section-title", text: "************** GRIDSYS **************", typeSpeed: 8 },
  );

  for (const row of GRIDSYS_ROWS) {
    const label = row.state ? `${row.cell}  ${row.state}` : row.cell;
    seq.push({
      col: "left",
      delay: 65,
      className: "boot-grid-row",
      render: () => <><span>{label}</span><span className="boot-tri">{row.tri}</span></>,
    });
  }

  seq.push(
    {
      col: "right",
      delay: 90,
      className: "boot-corr-sl",
      effect: "corr",
      render: (ctx) => (
        <>
          <span>CORR: Z0↔C4</span>
          <div className="boot-corr-blocks">
            <div className={`boot-corr-block ${ctx.corrOn ? "boot-corr-on" : ""}`} />
            <div className={`boot-corr-block ${ctx.corrOn ? "boot-corr-on" : ""}`} />
          </div>
        </>
      ),
    },
    {
      col: "left",
      delay: 80,
      className: "boot-armed-row",
      effect: "armed",
      render: (ctx) => (
        <>
          <span className="boot-armed-box" />
          <span>TOPO MAP</span>
          <div className="boot-bar">
            <div className="boot-bar-fill" style={{ width: `${ctx.armed1}%` }} />
          </div>
        </>
      ),
    },
    {
      col: "left",
      delay: 90,
      className: "boot-armed-row",
      effect: "armed",
      render: (ctx) => (
        <>
          <span className="boot-armed-box" />
          <span>HALFTONE</span>
          <div className="boot-bar">
            <div className="boot-bar-fill" style={{ width: `${ctx.armed2}%` }} />
          </div>
        </>
      ),
    },
    { col: "left", delay: 120, text: "" },
    { col: "left", delay: 100, className: "boot-section-title boot-section-left", text: "CH MAP: GZ-100 MODULE", typeSpeed: 12 },
  );

  for (const z of ZONE_MAP) {
    seq.push({
      col: "left",
      delay: 65,
      className: "boot-zone-line",
      text: `${z.id} ${z.zone} ${z.sig} → ${z.route}`,
      typeSpeed: 10,
    });
  }

  seq.push(
    { col: "left", delay: 90, className: "boot-zone-line boot-zone-drop", text: "ROUTES: 5/5 MAPPED   CRC ERR: 00.00%", typeSpeed: 10 },
    { col: "right", delay: 80, className: "boot-log-hdr", text: "ID   BRG   FREQ   TYPE", typeSpeed: 10 },
  );

  for (const c of RWR_CONTACTS) {
    seq.push({
      col: "right",
      delay: 65,
      className: "boot-log-row",
      text: `${c.id}   ${c.brg}   ${c.freq}   ${c.type}`,
      typeSpeed: 9,
    });
  }

  seq.push(
    { col: "right", delay: 110, className: "boot-log-row boot-log-gap", text: "PRIORITY: C4 ACQUIRE LOCK", typeSpeed: 10 },
    { col: "right", delay: 70, className: "boot-log-row", text: "AUTO MAPPING: ENABLED", typeSpeed: 10 },
    { col: "right", delay: 90, className: "boot-diag-line", effect: "diag", render: (ctx) => <>SIGNAL: {ctx.signal}</> },
    { col: "right", delay: 75, className: "boot-diag-line", render: (ctx) => <>GRID NODES: {ctx.gridNodes}</> },
    { col: "right", delay: 75, className: "boot-diag-line", render: (ctx) => <>TOPO CACHE: {ctx.topoCache}</> },
    { col: "right", delay: 75, className: "boot-diag-line", render: (ctx) => <>RF-GRID: {ctx.rfGrid}</> },
    { col: "right", delay: 75, className: "boot-diag-line", text: "LAST PING: C4  -00:04:22", typeSpeed: 10 },
  );

  for (const n of GRID_NODES) {
    seq.push({
      col: "left",
      delay: 70,
      className: "boot-coord-line",
      text: `${n.brg}  ${n.dist}  ◇ ${n.id}  ${n.offset}`,
      typeSpeed: 9,
    });
  }

  seq.push(
    {
      col: "right",
      delay: 90,
      className: "boot-diag-line",
      effect: "units",
      render: (ctx) => (
        <>CELL-1 142/s &nbsp; CELL-2 138/s &nbsp; CELL-3 {String(ctx.unit3).padStart(3, "0")}/s</>
      ),
    },
    {
      col: "right",
      delay: 80,
      className: "boot-diag-line",
      render: (ctx) => (
        <>TILE A {String(ctx.resA).padStart(2, "0")}% &nbsp; TILE B {String(ctx.resB).padStart(2, "0")}% &nbsp; UTL {String(ctx.resU).padStart(2, "0")}%</>
      ),
    },
    {
      col: "right",
      delay: 75,
      className: "boot-diag-line",
      render: (ctx) => <>[GRID-CTL] {ctx.gridCtl} &nbsp; [SKIN] DOWN &nbsp; [CHROME] UP-20°</>,
    },
    {
      col: "right",
      delay: 75,
      className: "boot-diag-line",
      render: (ctx) => <>[VOID] {ctx.voidSt} &nbsp; TEMP: {String(ctx.temp).padStart(3, "0")}°F</>,
    },
    { col: "right", delay: 70, className: "boot-diag-line", text: "FILT: OK   ACCUM: 0000PSI", typeSpeed: 10 },
    { col: "right", delay: 120, className: "boot-diag-line", text: ">> GZ-01 READY — ENTERING ZONE", typeSpeed: 10 },
    { col: "right", delay: 200, text: "" },
    { col: "right", delay: 90, className: "boot-corp", text: "ZONA Systems Corp.", typeSpeed: 16 },
    { col: "right", delay: 80, text: "GZ-01™ Ground Zero Sequence", typeSpeed: 14 },
    { col: "right", delay: 70, text: "FW 26.0 / BUILD GODLESS", typeSpeed: 14 },
    { col: "right", delay: 70, text: "© ZONA®, Buenos Aires.", typeSpeed: 14 },
  );

  return seq;
}

const BOOT_SEQUENCE = buildSequence();

function TypedLine({
  text,
  typeSpeed,
  active,
  className,
}: {
  text: string;
  typeSpeed?: number;
  active: boolean;
  className?: string;
}) {
  const [chars, setChars] = useState(typeSpeed ? 0 : text.length);

  useEffect(() => {
    if (!typeSpeed || !active) {
      setChars(text.length);
      return;
    }
    setChars(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setChars(i);
      if (i >= text.length) clearInterval(id);
    }, typeSpeed);
    return () => clearInterval(id);
  }, [text, typeSpeed, active]);

  const showCursor = active && chars < text.length;

  if (!text) return <div className="boot-stream-gap" aria-hidden="true" />;

  return (
    <div className={`boot-stream-line ${className ?? ""}`.trim()}>
      {text.slice(0, chars)}
      {showCursor && <span className="boot-inline-cursor">█</span>}
    </div>
  );
}

function StreamLine({
  step,
  index,
  activeIndex,
  ctx,
}: {
  step: BootStep;
  index: number;
  activeIndex: number;
  ctx: BootCtx;
}) {
  const active = index === activeIndex;

  if (step.render) {
    return (
      <div className={`boot-stream-line ${step.className ?? ""}`.trim()}>
        {step.render(ctx)}
      </div>
    );
  }

  return (
    <TypedLine
      text={step.text ?? ""}
      typeSpeed={step.typeSpeed}
      active={active}
      className={step.className}
    />
  );
}

export function BootSplash({
  onComplete,
  assetsReady,
}: {
  onComplete: () => void;
  assetsReady: boolean;
}) {
  const sequence = BOOT_SEQUENCE;
  const [lineIndex, setLineIndex] = useState(0);
  const [bootPct, setBootPct] = useState(0);
  const [bootStatus, setBootStatus] = useState("POST...");
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [done, setDone] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [sequenceDone, setSequenceDone] = useState(false);

  const [ctx, setCtx] = useState<BootCtx>({
    armed1: 0,
    armed2: 0,
    corrOn: false,
    unit3: 0,
    resA: 0,
    resB: 0,
    resU: 0,
    temp: 0,
    gridCtl: "STBY",
    voidSt: "CLOSED",
    signal: "NO CARRIER",
    gridNodes: "3/5",
    topoCache: "EMPTY",
    rfGrid: "STBY",
  });

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const animRef = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finishing) return;
    setSequenceDone(true);
    if (!assetsReady) return;
    setFinishing(true);
    setDone(true);
    window.setTimeout(onComplete, 650);
  }, [finishing, assetsReady, onComplete]);

  const completeSequence = useCallback(() => {
    setSequenceDone(true);
  }, []);

  const armedCountRef = useRef(0);

  const triggerSideEffects = useCallback((index: number) => {
    const step = sequence[index];
    if (!step?.effect) return;

    if (step.effect === "corr") {
      animRef.current.push(window.setTimeout(() => setCtx((c) => ({ ...c, corrOn: true })), 200));
    }
    if (step.effect === "armed") {
      armedCountRef.current += 1;
      const n = armedCountRef.current;
      animRef.current.push(
        window.setTimeout(
          () => setCtx((c) => (n === 1 ? { ...c, armed1: 100 } : { ...c, armed2: 72 })),
          120,
        ),
      );
    }
    if (step.effect === "units") {
      const bumps: Array<[number, Partial<BootCtx>]> = [
        [80, { unit3: 142, signal: "ACQUIRING" }],
        [200, { resA: 92, gridNodes: "4/5" }],
        [320, { resB: 89, topoCache: "WRITING" }],
        [440, { resU: 67 }],
        [560, { temp: 187, rfGrid: "LINK" }],
        [680, { gridCtl: "ACTIVE", voidSt: "OPEN", signal: "LOCKED", gridNodes: "5/5", topoCache: "LOADED", rfGrid: "ACTIVE" }],
      ];
      for (const [delay, patch] of bumps) {
        animRef.current.push(
          window.setTimeout(() => setCtx((c) => ({ ...c, ...patch })), delay),
        );
      }
    }
    if (step.effect === "diag") {
      animRef.current.push(
        window.setTimeout(() => setCtx((c) => ({ ...c, signal: "SCANNING" })), 400),
      );
    }
  }, [sequence]);

  const scheduleNext = useCallback(
    (index: number) => {
      if (finishing) return;

      if (index >= sequence.length) {
        window.setTimeout(completeSequence, 480);
        return;
      }

      setLineIndex(index + 1);
      triggerSideEffects(index);

      const step = sequence[index];
      const typeDelay = step.text && step.typeSpeed ? step.text.length * step.typeSpeed : 0;
      const nextDelay = sequence[index + 1]?.delay ?? 60;
      const wait = typeDelay + nextDelay;

      timerRef.current = window.setTimeout(() => scheduleNext(index + 1), wait);
    },
    [finishing, completeSequence, sequence, triggerSideEffects],
  );

  useEffect(() => {
    if (!sequenceDone || finishing || !assetsReady) return;
    setFinishing(true);
    setDone(true);
    window.setTimeout(onComplete, 650);
  }, [sequenceDone, assetsReady, finishing, onComplete]);

  useEffect(() => {
    scheduleNext(0);
    const skipTimer = window.setTimeout(() => setSkipEnabled(true), 1400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(skipTimer);
      animRef.current.forEach(clearTimeout);
    };
  }, [scheduleNext]);

  useEffect(() => {
    const animPct = Math.min(100, Math.floor((lineIndex / sequence.length) * 100));

    if (sequenceDone && !assetsReady) {
      setBootPct(95);
      setBootStatus("TOPO CACHE LOAD...");
      return;
    }

    setBootPct(assetsReady ? animPct : Math.min(animPct, 92));

    if (animPct < 20) setBootStatus("COLD POST...");
    else if (animPct < 35) setBootStatus("RF SPECTRUM SCAN...");
    else if (animPct < 50) setBootStatus("GRIDSYS HANDSHAKE...");
    else if (animPct < 70) setBootStatus("ZONE MAP SYNC...");
    else if (animPct < 85) setBootStatus("TOPO CACHE LOAD...");
    else if (animPct < 100) setBootStatus("GZ-01 READY...");
    else setBootStatus("SEQUENCE COMPLETE");
  }, [lineIndex, sequence.length, sequenceDone, assetsReady]);

  useEffect(() => {
    for (const ref of [leftRef, rightRef]) {
      const el = ref.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [lineIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!skipEnabled || finishing) return;
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipEnabled, finish, finishing]);

  const visibleLines = useMemo(
    () =>
      sequence
        .slice(0, lineIndex)
        .map((step, globalIdx) => ({ step, globalIdx })),
    [lineIndex, sequence],
  );

  const leftLines = visibleLines.filter(({ step }) => step.col === "left");
  const rightLines = visibleLines.filter(({ step }) => step.col === "right");
  const activeIndex = lineIndex - 1;

  return (
    <div
      role="dialog"
      aria-label="System boot sequence"
      aria-live="polite"
      className={`boot-splash font-mono ${done ? "boot-splash-done" : ""}`}
      onClick={() => skipEnabled && !finishing && finish()}
    >
      <div className="boot-lang-wrap">
        <LangToggle className="lang-toggle lang-toggle-boot" />
      </div>

      <div className="boot-glitch-band" aria-hidden="true" />

      <div className="boot-terminal-wrap">
        <div className="boot-terminal">
          <div className="boot-col boot-stream-col" ref={leftRef}>
            {leftLines.map(({ step, globalIdx }) => (
                <StreamLine
                  key={`l-${globalIdx}`}
                  step={step}
                  index={globalIdx}
                  activeIndex={activeIndex}
                  ctx={ctx}
                />
            ))}
            {lineIndex < sequence.length && leftLines.length >= rightLines.length && (
              <div className="boot-stream-line boot-stream-prompt">
                <span className="boot-inline-cursor">█</span>
              </div>
            )}
          </div>

          <div className="boot-divider" aria-hidden="true" />

          <div className="boot-col boot-stream-col" ref={rightRef}>
            {rightLines.map(({ step, globalIdx }) => (
                <StreamLine
                  key={`r-${globalIdx}`}
                  step={step}
                  index={globalIdx}
                  activeIndex={activeIndex}
                  ctx={ctx}
                />
            ))}
            {lineIndex < sequence.length && rightLines.length > leftLines.length && (
              <div className="boot-stream-line boot-stream-prompt">
                <span className="boot-inline-cursor">█</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="boot-glitch-band boot-glitch-bottom" aria-hidden="true" />

      <div className="boot-footer">
        <span>{bootStatus}</span>
        <div className="boot-progress">
          <div className="boot-bar-wrap">
            <div className="boot-bar boot-boot-bar" style={{ width: `${bootPct}%` }} />
          </div>
          <span>{String(bootPct).padStart(3, "0")}%</span>
        </div>
        <span className={`boot-skip-hint ${skipEnabled ? "boot-skip-show" : ""}`}>
          [ ESC / CLICK TO SKIP ]
        </span>
        <span className="boot-cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
