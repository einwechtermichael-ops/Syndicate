import { useState, useEffect, useRef } from "react";

const C = {
  void:"#050505", deep:"#0a0a0a", panel:"#0d1e2a",
  cyan:"#06b6d4", cyanGlow:"#22d3ee", cyanBright:"#67e8f9",
  red:"#ef4444",  redGlow:"#f87171",
  purple:"#a855f7", purpleGlow:"#c084fc",
  gold:"#fbbf24", green:"#22c55e", amber:"#ff8c00",
  text:"#e0f4ff", textSec:"#7ab8d0", textMuted:"#3a6070", textOff:"#1a3040",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');

  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #000; color: #e0f4ff;
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${C.cyan}, ${C.purple}); border-radius: 3px; }

  @keyframes scanDrift { 0%{background-position:0 0} 100%{background-position:0 600px} }
  @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes redPulse {
    0%,100% { box-shadow: 0 0 8px rgba(239,68,68,0.4), inset 0 0 8px rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.7); }
    50%     { box-shadow: 0 0 24px rgba(239,68,68,0.9), 0 0 48px rgba(239,68,68,0.4), inset 0 0 12px rgba(239,68,68,0.2); border-color: rgba(239,68,68,1); }
  }
  @keyframes cyanGlow {
    0%,100% { box-shadow: 0 0 12px rgba(6,182,212,0.45), 0 0 32px rgba(6,182,212,0.2); }
    50%     { box-shadow: 0 0 24px rgba(6,182,212,0.85), 0 0 56px rgba(6,182,212,0.35); }
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes flicker {
    0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0.5} 51%{opacity:1} 92%{opacity:1} 93%{opacity:0.6} 94%{opacity:1}
  }
  @keyframes orbSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slide-in-left {
    from { opacity:0; transform:translateX(-24px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes terminalCursor { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes gridFloat {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }
  @keyframes typingDot {
    0%,80%,100% { transform: scale(0); opacity: 0.4; }
    40%         { transform: scale(1); opacity: 1; }
  }

  .scanlines {
    position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.04;
    background: repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 3px);
    animation: scanDrift 14s linear infinite;
  }

  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridFloat 30s linear infinite;
  }

  .ambient-glow {
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    background:
      radial-gradient(ellipse 800px 600px at 20% 10%, rgba(6,182,212,0.08), transparent 60%),
      radial-gradient(ellipse 600px 800px at 80% 60%, rgba(168,85,247,0.06), transparent 60%),
      radial-gradient(ellipse 400px 400px at 50% 100%, rgba(239,68,68,0.05), transparent 60%);
  }

  .neon-text-cyan {
    color: #fff;
    text-shadow:
      0 0 1px #fff, 0 0 4px ${C.cyan}, 0 0 8px ${C.cyan},
      0 0 16px ${C.cyan}, 0 0 32px rgba(6,182,212,0.6);
  }
  .neon-text-red {
    color: #ffecec;
    text-shadow:
      0 0 1px #fff, 0 0 4px ${C.red}, 0 0 8px ${C.red},
      0 0 16px ${C.red}, 0 0 32px rgba(239,68,68,0.6);
  }
  .neon-text-cyan-soft {
    color: ${C.cyanBright};
    text-shadow: 0 0 4px ${C.cyan}, 0 0 12px rgba(6,182,212,0.5);
  }
  .neon-text-purple {
    color: ${C.purpleGlow};
    text-shadow: 0 0 4px ${C.purple}, 0 0 12px rgba(168,85,247,0.5);
  }

  .neon-border-cyan {
    border: 1px solid rgba(6,182,212,0.5);
    box-shadow: 0 0 12px rgba(6,182,212,0.3), inset 0 0 12px rgba(6,182,212,0.05);
  }
  .neon-border-cyan-strong {
    border: 1.5px solid ${C.cyan};
    box-shadow:
      0 0 4px ${C.cyan},
      0 0 16px rgba(6,182,212,0.7),
      0 0 40px rgba(6,182,212,0.35),
      inset 0 0 16px rgba(6,182,212,0.08);
  }

  .glass {
    background: rgba(13, 30, 42, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* Phone frame */
  .phone-frame {
    width: 280px; aspect-ratio: 9/19;
    background: ${C.void}; border-radius: 28px;
    border: 2px solid rgba(6,182,212,0.3);
    overflow: hidden; position: relative;
    box-shadow:
      0 0 0 4px #1a1a1a,
      0 0 0 5px rgba(6,182,212,0.15),
      0 30px 60px rgba(0,0,0,0.9),
      0 0 80px rgba(6,182,212,0.15);
  }
  .phone-notch {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 84px; height: 22px; background: #000;
    border-radius: 0 0 12px 12px; z-index: 100;
  }

  /* Section reveal on scroll */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Hero CTA pulsing button */
  .hero-cta {
    position: relative;
    background: linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.08));
    border: 1.5px solid ${C.cyan};
    color: ${C.cyanBright};
    padding: 16px 36px;
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 0 0 8px ${C.cyan};
    animation: cyanGlow 2.5s ease-in-out infinite;
  }
  .hero-cta:hover {
    background: linear-gradient(135deg, rgba(6,182,212,0.4), rgba(6,182,212,0.15));
    transform: translateY(-2px);
    box-shadow: 0 0 32px rgba(6,182,212,1), 0 0 64px rgba(6,182,212,0.5);
  }
  .hero-cta:active { transform: scale(0.97); }

  .nav-link {
    color: ${C.textSec};
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 3px;
  }
  .nav-link:hover {
    color: ${C.cyanBright};
    background: rgba(6,182,212,0.08);
    text-shadow: 0 0 8px ${C.cyan};
  }

  .feature-card {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .feature-card:hover {
    transform: translateY(-6px) scale(1.01);
  }

  .panel-tab {
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
  }
  .panel-tab:hover { color: ${C.cyanBright}; }
  .panel-tab.active {
    color: ${C.cyanBright};
    border-bottom-color: ${C.cyan};
    text-shadow: 0 0 8px ${C.cyan};
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .hero-title { font-size: 48px !important; }
    .hero-sub { font-size: 14px !important; }
    .section-title { font-size: 28px !important; }
    .section { padding: 60px 16px !important; }
    .feature-grid { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr !important; }
    .phone-frame { width: 240px !important; }
  }
  @media (min-width: 769px) {
    .mobile-only { display: none !important; }
  }
`;

// ════════════════════════════════════════════════════════════════
//  PHONE PREVIEW COMPONENTS
// ════════════════════════════════════════════════════════════════

function DashboardPreview() {
  const cards = [
    { game: "Dragon Link — Golden Century", casino: "DraftKings", tys: 98, sig: "VULTURE", col: C.red, src: "SENTINEL" },
    { game: "Lightning Link — Magic Pearl", casino: "Borgata", tys: 87, sig: "HOT", col: C.amber, src: "CREW" },
    { game: "Buffalo Gold Revolution", casino: "Harrah's", tys: 31, sig: "TRAP", col: C.red, src: "USER" },
  ];
  return (
    <div style={{ height: "100%", background: C.void, display: "flex", flexDirection: "column" }}>
      <div className="phone-notch" />
      <div style={{ padding: "32px 12px 8px", borderBottom: `1px solid rgba(239,68,68,0.2)` }}>
        <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 8, color: C.textMuted, letterSpacing: 2 }}>OPERATOR</div>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 18, animation: "flicker 6s linear infinite" }}
             className="neon-text-red">THE ARCHITECT</div>
      </div>
      <div style={{ padding: "4px 8px", background: "rgba(168,85,247,0.06)", borderBottom: `1px solid rgba(168,85,247,0.2)`, overflow: "hidden", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 7, color: C.purpleGlow }}>
          [SENTINEL_01: SCANNING DRAFTKINGS...] · [SENTINEL_02: SCORING — 48 MACHINES]
        </span>
      </div>
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            position: "relative", borderRadius: 4,
            border: `1px solid ${c.col}55`,
            background: c.sig === "VULTURE" ? "rgba(22,5,5,0.7)" : "rgba(13,30,42,0.6)",
            padding: 8, paddingLeft: 12,
            animation: c.sig === "VULTURE" ? "redPulse 1.2s ease-in-out infinite" : "none",
          }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.col }} />
            {c.sig === "VULTURE" && (
              <div style={{ background: "rgba(239,68,68,0.15)", borderBottom: `1px solid ${C.red}44`, margin: "-8px -8px 6px -12px", padding: "3px 12px", textAlign: "center" }}>
                <span style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 7, color: C.red, letterSpacing: 2, animation: "pulse 0.8s infinite" }}>🦅 VULTURE STATE DETECTED</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Rajdhani'", fontWeight: 700, fontSize: 11, color: C.text, lineHeight: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.game}</div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 8, color: C.textMuted }}>{c.casino} · {c.src}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 6, color: C.textMuted, letterSpacing: 1.5 }}>TYS</div>
                <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 22, color: c.col, lineHeight: 1, textShadow: `0 0 8px ${c.col}` }}>{c.tys}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VaultPreview() {
  return (
    <div style={{ height: "100%", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px 16px", gap: 8 }}>
      <div className="phone-notch" />
      <div style={{ fontFamily: "'Orbitron'", fontSize: 8, letterSpacing: 4, color: C.textMuted }}>SYNDICATE</div>
      <div className="neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 36, letterSpacing: 6, lineHeight: 1 }}>VAULT</div>

      {/* Vault SVG */}
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ filter: `drop-shadow(0 0 12px ${C.cyan})`, animation: "float 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="face" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1a3a4a" />
            <stop offset="100%" stopColor="#050d14" />
          </radialGradient>
          <radialGradient id="bolt" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
        </defs>
        <circle cx={60} cy={60} r={56} fill="none" stroke={C.cyan} strokeWidth={1} opacity={0.3} />
        <circle cx={60} cy={60} r={50} fill="url(#face)" stroke={C.cyan} strokeWidth={2} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <circle key={i} cx={60 + 38 * Math.cos(a * Math.PI / 180)} cy={60 + 38 * Math.sin(a * Math.PI / 180)} r={3} fill="url(#bolt)" stroke={C.cyanGlow} strokeWidth={0.6} />
        ))}
        <circle cx={60} cy={60} r={26} fill="#080f15" stroke={C.cyan} strokeWidth={1.5} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const inner = i % 4 === 0 ? 22 : 24;
          return (<line key={i} x1={60 + 26 * Math.cos(a)} y1={60 + 26 * Math.sin(a)} x2={60 + inner * Math.cos(a)} y2={60 + inner * Math.sin(a)} stroke={C.cyan} strokeWidth={i % 4 === 0 ? 1.2 : 0.6} opacity={0.7} />);
        })}
        {[0, 90, 180, 270].map((a, i) => (
          <line key={i} x1={60 + 6 * Math.cos(a * Math.PI / 180)} y1={60 + 6 * Math.sin(a * Math.PI / 180)} x2={60 + 14 * Math.cos(a * Math.PI / 180)} y2={60 + 14 * Math.sin(a * Math.PI / 180)} stroke={C.cyan} strokeWidth={2} strokeLinecap="round" />
        ))}
        <circle cx={60} cy={60} r={5} fill="#0a1a24" stroke={C.cyanGlow} strokeWidth={1} />
      </svg>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        {["Real-Time Sentinel Alerts", "Vulture Strategy Guides", "Crew-Verified Intel"].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 4, borderBottom: `1px solid rgba(6,182,212,0.1)` }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, border: `1px solid ${C.cyan}`, background: `rgba(6,182,212,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 4px ${C.cyan}` }}>
              <span style={{ fontSize: 8, color: C.cyan, fontWeight: 700 }}>✓</span>
            </div>
            <span style={{ fontFamily: "'Rajdhani'", fontWeight: 600, fontSize: 9, color: C.text }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", padding: "10px 0", borderRadius: 4, border: `1.5px solid ${C.cyan}`, background: `rgba(6,182,212,0.12)`, textAlign: "center", animation: "cyanGlow 2.5s ease-in-out infinite", marginTop: 4 }}>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 9, letterSpacing: 2, color: C.cyan }}>SUBSCRIBE</div>
        <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 18, color: C.cyan, textShadow: `0 0 8px ${C.cyan}` }}>$49.99</div>
      </div>
    </div>
  );
}

function StrategyPreview() {
  return (
    <div style={{ height: "100%", background: C.void, display: "flex", flexDirection: "column" }}>
      <div className="phone-notch" />
      <div style={{ padding: "32px 10px 6px", borderBottom: `1px solid rgba(168,85,247,0.2)` }}>
        <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 7, color: C.textMuted }}>// SYNDICATE PLAYBOOK</div>
        <div style={{ fontFamily: "'Rajdhani'", fontWeight: 700, fontSize: 13, color: C.text, lineHeight: "16px" }}>Dragon Link — Golden Century</div>
        <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 7, color: C.textMuted, marginTop: 2 }}>DraftKings Casino</div>
        <div style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", border: `1px solid ${C.red}66`, borderRadius: 2, background: `rgba(239,68,68,0.12)` }}>
          <span style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 7, color: C.red, letterSpacing: 1 }}>CRITICAL ADVANTAGE</span>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid rgba(168,85,247,0.2)`, background: "rgba(168,85,247,0.04)" }}>
        {[{ k: "TYS", v: "98", c: C.red }, { k: "RTP", v: "96.6%", c: C.cyan }, { k: "VOL", v: "MAX", c: C.gold }].map(s => (
          <div key={s.k} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRight: `1px solid rgba(168,85,247,0.15)` }}>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 6, color: C.textMuted, letterSpacing: 1.5 }}>{s.k}</div>
            <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 16, color: s.c, textShadow: `0 0 6px ${s.c}` }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4, flex: 1, overflow: "hidden" }}>
        <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 2, color: C.purpleGlow }}>BANKROLL ALLOCATION</div>
        {[{ l: "Session Bankroll", v: "$500", c: C.cyan }, { l: "Recommended Bet", v: "$10/spin", c: C.gold }].map(r => (
          <div key={r.l} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4, borderBottom: `1px solid rgba(168,85,247,0.1)` }}>
            <span style={{ fontFamily: "'Rajdhani'", fontWeight: 500, fontSize: 10, color: C.textSec }}>{r.l}</span>
            <span style={{ fontFamily: "'Share Tech Mono'", fontWeight: 700, fontSize: 11, color: r.c }}>{r.v}</span>
          </div>
        ))}
        <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 2, color: C.purpleGlow, marginTop: 4 }}>RISK PARAMETERS</div>
        {[{ l: "Stop-Loss", v: "-$200", c: C.red }, { l: "Win Target", v: "+$400", c: C.green }].map(r => (
          <div key={r.l} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 4, borderBottom: `1px solid rgba(168,85,247,0.1)` }}>
            <span style={{ fontFamily: "'Rajdhani'", fontWeight: 500, fontSize: 10, color: C.textSec }}>{r.l}</span>
            <span style={{ fontFamily: "'Share Tech Mono'", fontWeight: 700, fontSize: 12, color: r.c }}>{r.v}</span>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: "5px 8px", border: `1px solid ${C.red}55`, borderRadius: 3, background: "rgba(239,68,68,0.08)" }}>
          <div style={{ fontFamily: "'Orbitron'", fontSize: 7, color: C.red, letterSpacing: 1.5 }}>🦅 VULTURE PROTOCOL</div>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 8, color: C.textMuted, lineHeight: "11px", marginTop: 2 }}>45-min hard limit. Strike fast.</div>
        </div>
      </div>
    </div>
  );
}

function OnlineLedgerPreview() {
  return (
    <div style={{ height: "100%", background: C.void, display: "flex", flexDirection: "column" }}>
      <div className="phone-notch" />
      <div style={{ padding: "32px 10px 6px", borderBottom: `1px solid rgba(168,85,247,0.2)` }}>
        <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 7, color: C.textMuted, letterSpacing: 1.5 }}>// AI-POWERED · PANEL 08</div>
        <div className="neon-text-purple" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 14 }}>ONLINE LEDGER</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: 8 }}>
        {[
          { name: "DraftKings", col: "#53d337", adv: 6, icon: "🎰" },
          { name: "BetMGM", col: "#c8a84b", adv: 4, icon: "♦" },
          { name: "FanDuel", col: "#1493ff", adv: 3, icon: "◈" },
          { name: "Caesars", col: "#e8c060", adv: 5, icon: "♜" },
        ].map(p => (
          <div key={p.name} style={{ border: `1px solid ${p.col}55`, borderRadius: 3, background: "rgba(13,30,42,0.6)", padding: 6, textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>{p.icon}</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 7, color: C.textMuted }}>{p.name}</div>
            <div style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 8, color: p.col, marginTop: 2 }}>{p.adv} ADVANTAGE</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: p.col, animation: "pulse 1.5s infinite" }} />
              <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 6, color: p.col }}>SCANNING</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {[{ game: "Dragon Link — Golden", tys: 98, sig: "VULTURE", col: C.red }, { game: "Jackpot Party — Mega", tys: 91, sig: "HOT", col: C.amber }].map((c, i) => (
          <div key={i} style={{ border: `1px solid ${i === 0 ? C.red : C.purple}44`, borderRadius: 3, background: i === 0 ? "rgba(22,5,5,0.6)" : "rgba(13,30,42,0.6)", padding: "5px 8px", position: "relative", animation: i === 0 ? "redPulse 1.4s infinite" : "none" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: C.purple, borderRadius: "3px 0 0 3px" }} />
            {i === 0 && <div style={{ textAlign: "center" }}><span style={{ fontFamily: "'Orbitron'", fontSize: 6, color: C.red, animation: "pulse 0.8s infinite" }}>🦅 VULTURE STATE</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Rajdhani'", fontWeight: 600, fontSize: 10, color: C.text }}>{c.game}</div>
              <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 16, color: c.col, textShadow: `0 0 6px ${c.col}` }}>{c.tys}</div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 5, color: C.purpleGlow }}>◈ AI SENTINEL</span>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 5, color: c.col }}>🔒 PAID</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANEL_PREVIEWS = [
  { id: "dashboard", label: "DASHBOARD", desc: "Live machine intelligence feed with Vulture State alerts, TYS scores, and AI Sentinel terminal", component: <DashboardPreview /> },
  { id: "vault", label: "VAULT", desc: "Subscription gateway for premium intelligence — strategy guides, real-time alerts, exclusive intel", component: <VaultPreview /> },
  { id: "strategy", label: "STRATEGY", desc: "AI-generated playbook with bet sizing, stop-loss, and Vulture Protocol for every advantage state", component: <StrategyPreview /> },
  { id: "ledger", label: "ONLINE LEDGER", desc: "AI Sentinel scans DraftKings, BetMGM, FanDuel, Caesars in real-time for advantage opportunities", component: <OnlineLedgerPreview /> },
];

// ════════════════════════════════════════════════════════════════
//  REVEAL ON SCROLL HOOK
// ════════════════════════════════════════════════════════════════
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ════════════════════════════════════════════════════════════════
//  MAIN INVESTOR DEMO SITE
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [tysDemo, setTysDemo] = useState(50);
  const currentPanel = PANEL_PREVIEWS.find(p => p.id === activePanel);

  useReveal();

  // Animated TYS counter
  useEffect(() => {
    let frame;
    const animate = () => {
      setTysDemo(prev => {
        const target = 98;
        const diff = target - prev;
        return Math.abs(diff) < 0.5 ? target : prev + diff * 0.04;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    setTimeout(() => cancelAnimationFrame(frame), 4000);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="grid-bg" />
      <div className="ambient-glow" />
      <div className="scanlines" />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(5,5,5,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(6,182,212,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.cyan, fontSize: 18, animation: "pulse 2s infinite" }}>◈</span>
          <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 13, letterSpacing: 3, color: C.cyanBright }}>SYNDICATE LEDGER</span>
        </div>
        <div className="desktop-only" style={{ display: "flex", gap: 4 }}>
          <a href="#problem" className="nav-link">Problem</a>
          <a href="#solution" className="nav-link">Solution</a>
          <a href="#product" className="nav-link">Product</a>
          <a href="#market" className="nav-link">Market</a>
          <a href="#business" className="nav-link">Business</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <div style={{ padding: "4px 10px", border: `1px solid ${C.green}55`, borderRadius: 2, background: `rgba(34,197,94,0.08)` }}>
          <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, color: C.green, letterSpacing: 1 }}>● SEEKING SEED</span>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 32px 60px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }} className="feature-grid">
          {/* Left: copy */}
          <div style={{ animation: "fadeUp 0.8s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: `1px solid ${C.red}55`, borderRadius: 2, background: `rgba(239,68,68,0.08)`, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: C.red, animation: "pulse 1.2s infinite", boxShadow: `0 0 6px ${C.red}` }} />
              <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, letterSpacing: 2, color: C.red }}>VULTURE STATE: ACTIVE</span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 72,
              letterSpacing: 2, lineHeight: 0.95, marginBottom: 20,
            }}>
              <span className="neon-text-cyan">CASINO</span><br />
              <span className="neon-text-red">INTELLIGENCE</span><br />
              <span className="neon-text-cyan-soft" style={{ fontSize: "0.5em", letterSpacing: 8 }}>FOR THE EDGE PLAYER</span>
            </h1>

            <p className="hero-sub" style={{ fontFamily: "'Rajdhani'", fontWeight: 500, fontSize: 18, color: C.textSec, lineHeight: 1.5, maxWidth: 540, marginBottom: 32 }}>
              An AI-powered intelligence platform that scans every major online casino in real-time, identifies advantage-state machines, and delivers Vulture-level alerts to subscribed operators.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <button className="hero-cta" onClick={() => document.getElementById("product").scrollIntoView()}>
                EXPLORE THE PRODUCT →
              </button>
              <button className="nav-link" style={{ padding: "16px 24px", border: `1px solid rgba(6,182,212,0.3)`, borderRadius: 0, color: C.textSec, fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 11, letterSpacing: 2 }}
                      onClick={() => document.getElementById("contact").scrollIntoView()}>
                INVESTOR DECK →
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, paddingTop: 32, borderTop: `1px solid rgba(6,182,212,0.15)` }}>
              {[
                { val: "$95B", label: "US ONLINE CASINO TAM" },
                { val: "180s", label: "SENTINEL SCAN INTERVAL" },
                { val: "5", label: "PRIORITY GAMES TRACKED" },
              ].map(s => (
                <div key={s.label}>
                  <div className="neon-text-cyan-soft" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 8, letterSpacing: 1.5, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero phone */}
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp 1s ease 0.2s both" }}>
            <div style={{ position: "relative" }}>
              <div className="phone-frame" style={{ animation: "float 6s ease-in-out infinite" }}>
                <DashboardPreview />
              </div>
              {/* Floating TYS callout */}
              <div style={{
                position: "absolute", top: 40, right: -80, padding: "10px 16px",
                border: `1.5px solid ${C.cyan}`, borderRadius: 4,
                background: "rgba(5,5,5,0.95)", animation: "cyanGlow 2.5s ease-in-out infinite",
              }} className="desktop-only">
                <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.textMuted }}>TYS SCORE</div>
                <div className="neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{Math.round(tysDemo)}</div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 8, color: C.green, marginTop: 4 }}>● ADVANTAGE</div>
              </div>
              {/* Floating alert callout */}
              <div style={{
                position: "absolute", bottom: 60, left: -90, padding: "8px 12px",
                border: `1.5px solid ${C.red}`, borderRadius: 4,
                background: "rgba(5,5,5,0.95)", animation: "redPulse 1.4s ease-in-out infinite",
              }} className="desktop-only">
                <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.red }}>🦅 VULTURE FIRED</div>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, color: C.text, marginTop: 4 }}>Dragon Link · DraftKings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section id="problem" className="section reveal" style={{ padding: "100px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.red, marginBottom: 12 }}>▸ THE PROBLEM ◂</div>
          <h2 className="section-title neon-text-red" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 40, lineHeight: 1.1 }}>
            THE EDGE IS HIDDEN<br />
            BEHIND ENCRYPTED DATA
          </h2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🎰", title: "OPAQUE MATH", desc: "Casino game RTP, volatility, and progressive thresholds are buried in regulatory filings most players never see." },
              { icon: "⏱", title: "TIMING IS EVERYTHING", desc: "Advantage windows last minutes. By the time a player hears about a hot machine, the math has already shifted." },
              { icon: "📡", title: "FRAGMENTED INTEL", desc: "DraftKings, BetMGM, FanDuel, Caesars — no platform aggregates real-time intelligence across all of them." },
            ].map(p => (
              <div key={p.title} className="feature-card glass" style={{ padding: 28, borderRadius: 4, border: `1px solid rgba(239,68,68,0.2)` }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 14, letterSpacing: 2, color: C.redGlow, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontFamily: "'Rajdhani'", fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section id="solution" className="section reveal" style={{ padding: "100px 32px", background: "linear-gradient(180deg, transparent, rgba(6,182,212,0.04), transparent)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.cyan, marginBottom: 12 }}>▸ THE SOLUTION ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 16, lineHeight: 1.1 }}>
            AI SENTINEL +<br />TRUE YIELD SCORE
          </h2>
          <p style={{ fontFamily: "'Rajdhani'", fontSize: 18, color: C.textSec, marginBottom: 60, maxWidth: 720 }}>
            Three autonomous AI agents continuously scan online casino lobbies, score every machine on a proprietary 0–100 scale, and broadcast Vulture-state alerts to subscribed operators in seconds.
          </p>

          {/* Pipeline diagram */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 60 }} className="feature-grid">
            {[
              { step: "01", title: "SCRAPE", desc: "Playwright stealth scrapers monitor 4 platforms × 5 priority games every 180 seconds", color: C.purple },
              { step: "02", title: "SCORE", desc: "TYS engine computes weighted score from jackpot velocity, RTP, bonus frequency, volatility, momentum", color: C.cyan },
              { step: "03", title: "DETECT", desc: "Vulture threshold (TYS ≥ 97) triggers a critical alert; advantage states (TYS ≥ 95) trigger high priority", color: C.amber },
              { step: "04", title: "DISPATCH", desc: "Push notifications fire to subscribers within 5 seconds of state change. In-app banners drop simultaneously", color: C.red },
            ].map((s, i) => (
              <div key={s.step} style={{ position: "relative" }}>
                <div className="feature-card" style={{ padding: 20, borderRadius: 4, background: "rgba(13,30,42,0.6)", border: `1px solid ${s.color}44`, height: "100%", boxShadow: `0 0 16px ${s.color}22` }}>
                  <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 32, color: s.color, opacity: 0.5, lineHeight: 1, marginBottom: 8, textShadow: `0 0 12px ${s.color}` }}>{s.step}</div>
                  <h4 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 13, letterSpacing: 2, color: s.color, marginBottom: 10 }}>{s.title}</h4>
                  <p style={{ fontFamily: "'Rajdhani'", fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
                {i < 3 && <div className="desktop-only" style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", color: C.cyan, fontSize: 16, zIndex: 1 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT ═══ */}
      <section id="product" className="section reveal" style={{ padding: "100px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.purpleGlow, marginBottom: 12 }}>▸ THE PRODUCT ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 16, lineHeight: 1.1 }}>
            10 PANELS. ONE PLATFORM.
          </h2>
          <p style={{ fontFamily: "'Rajdhani'", fontSize: 18, color: C.textSec, marginBottom: 48, maxWidth: 720 }}>
            React Native (Expo) mobile app with Skia hardware-accelerated rendering. Cyberpunk Executive aesthetic. Tap a panel to explore.
          </p>

          {/* Panel tabs */}
          <div style={{ display: "flex", gap: 32, borderBottom: `1px solid rgba(6,182,212,0.2)`, marginBottom: 48, overflowX: "auto", paddingBottom: 12 }}>
            {PANEL_PREVIEWS.map(p => (
              <div key={p.id}
                   className={`panel-tab ${activePanel === p.id ? "active" : ""}`}
                   onClick={() => setActivePanel(p.id)}
                   style={{
                     fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 12, letterSpacing: 2,
                     color: activePanel === p.id ? C.cyanBright : C.textMuted,
                     paddingBottom: 12, whiteSpace: "nowrap",
                   }}>
                {p.label}
              </div>
            ))}
          </div>

          {/* Active panel showcase */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }} className="feature-grid">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="phone-frame" key={activePanel} style={{ animation: "fadeUp 0.5s ease both" }}>
                {currentPanel.component}
              </div>
            </div>
            <div key={activePanel + "-desc"} style={{ animation: "fadeUp 0.5s ease 0.1s both" }}>
              <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, letterSpacing: 3, color: C.textMuted, marginBottom: 8 }}>
                ▸ {currentPanel.label}
              </div>
              <h3 className="neon-text-cyan-soft" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 32, letterSpacing: 1, marginBottom: 16, lineHeight: 1.1 }}>
                {currentPanel.label === "DASHBOARD" && "LIVE INTEL FEED"}
                {currentPanel.label === "VAULT" && "PREMIUM GATEWAY"}
                {currentPanel.label === "STRATEGY" && "AI PLAYBOOK"}
                {currentPanel.label === "ONLINE LEDGER" && "SENTINEL FEED"}
              </h3>
              <p style={{ fontFamily: "'Rajdhani'", fontSize: 16, color: C.textSec, lineHeight: 1.6, marginBottom: 24 }}>
                {currentPanel.desc}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {currentPanel.label === "DASHBOARD" && [
                  { k: "Refresh", v: "Real-time" },
                  { k: "Sources", v: "3 (CREW/USER/AI)" },
                  { k: "Vulture Alerts", v: "TYS ≥ 97" },
                  { k: "Filter Modes", v: "7 channels" },
                ].map(s => (
                  <div key={s.k} style={{ padding: "10px 14px", border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 3, background: "rgba(6,182,212,0.04)" }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.textMuted }}>{s.k}</div>
                    <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: C.cyanBright, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
                {currentPanel.label === "VAULT" && [
                  { k: "Price", v: "$49.99/mo" },
                  { k: "Trial", v: "7 days free" },
                  { k: "Features", v: "6 unlocks" },
                  { k: "VM Discount", v: "50% off" },
                ].map(s => (
                  <div key={s.k} style={{ padding: "10px 14px", border: `1px solid rgba(6,182,212,0.2)`, borderRadius: 3, background: "rgba(6,182,212,0.04)" }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.textMuted }}>{s.k}</div>
                    <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: C.cyanBright, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
                {currentPanel.label === "STRATEGY" && [
                  { k: "Bet Tiers", v: "4 (Entry → Vulture)" },
                  { k: "Stop-Loss", v: "40% bankroll" },
                  { k: "Win Target", v: "50–80%" },
                  { k: "Game Coverage", v: "5 priority" },
                ].map(s => (
                  <div key={s.k} style={{ padding: "10px 14px", border: `1px solid rgba(168,85,247,0.2)`, borderRadius: 3, background: "rgba(168,85,247,0.04)" }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.textMuted }}>{s.k}</div>
                    <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: C.purpleGlow, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
                {currentPanel.label === "ONLINE LEDGER" && [
                  { k: "Platforms", v: "4 major" },
                  { k: "Scan Cycle", v: "180s" },
                  { k: "Stealth", v: "Playwright" },
                  { k: "Data Volume", v: "~480 scans/day" },
                ].map(s => (
                  <div key={s.k} style={{ padding: "10px 14px", border: `1px solid rgba(168,85,247,0.2)`, borderRadius: 3, background: "rgba(168,85,247,0.04)" }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 7, letterSpacing: 1.5, color: C.textMuted }}>{s.k}</div>
                    <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: C.purpleGlow, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MARKET ═══ */}
      <section id="market" className="section reveal" style={{ padding: "100px 32px", background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.04), transparent)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.purpleGlow, marginBottom: 12 }}>▸ MARKET OPPORTUNITY ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 48, lineHeight: 1.1 }}>
            $95B AND ACCELERATING
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 48 }} className="three-col">
            {[
              { val: "$95B", label: "TAM", desc: "US online casino & sports betting market by 2028 (H2 Gambling Capital)" },
              { val: "$8B", label: "SAM", desc: "Annual revenue from advantage-seeking players in regulated US states" },
              { val: "$120M", label: "SOM (5yr)", desc: "Conservative subscriber capture at 200K active users by year 5" },
            ].map(m => (
              <div key={m.label} className="feature-card glass" style={{ padding: 32, borderRadius: 4, border: `1px solid rgba(168,85,247,0.25)`, textAlign: "center" }}>
                <div className="neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 56, lineHeight: 1, marginBottom: 8 }}>{m.val}</div>
                <div style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 12, letterSpacing: 3, color: C.purpleGlow, marginBottom: 12 }}>{m.label}</div>
                <p style={{ fontFamily: "'Rajdhani'", fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Market trends */}
          <div className="glass" style={{ padding: 32, borderRadius: 4, border: `1px solid rgba(6,182,212,0.2)` }}>
            <h3 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 16, letterSpacing: 2, color: C.cyanBright, marginBottom: 24 }}>WHY NOW</h3>
            <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {[
                { trend: "STATE LEGALIZATION", detail: "Online casino legal in 7 states; 14 more under consideration. Each state opens millions of new TAM." },
                { trend: "MOBILE-FIRST PLAYERS", detail: "78% of online casino revenue is now mobile. Native app distribution is the moat." },
                { trend: "AI/ML MATURATION", detail: "Playwright stealth + LLM-driven scoring at $10/month compute makes this economically possible for the first time." },
                { trend: "REGULATORY FRAMEWORK", detail: "Public RTP filings in NJ, PA, MI provide the data foundation for objective scoring at scale." },
              ].map(t => (
                <div key={t.trend} style={{ paddingLeft: 16, borderLeft: `2px solid ${C.cyan}` }}>
                  <h4 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: C.cyan, marginBottom: 6 }}>{t.trend}</h4>
                  <p style={{ fontFamily: "'Rajdhani'", fontSize: 14, color: C.textSec, lineHeight: 1.5 }}>{t.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BUSINESS MODEL ═══ */}
      <section id="business" className="section reveal" style={{ padding: "100px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.gold, marginBottom: 12 }}>▸ BUSINESS MODEL ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 48, lineHeight: 1.1 }}>
            THREE REVENUE STREAMS
          </h2>

          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                tier: "CONSUMER", title: "VAULT SUBSCRIPTION",
                price: "$49.99", unit: "/mo",
                desc: "Mobile app subscribers. Real-time alerts, strategy guides, full Sentinel feed access.",
                color: C.cyan,
                features: ["10K subs by Y2 = $6M ARR", "Vault Master tier discounting", "7-day free trial funnel"],
              },
              {
                tier: "B2B", title: "DATA EXHAUST API",
                price: "$2,500", unit: "/mo",
                desc: "Sentinel intelligence feed for licensed operators, professional gambling syndicates, fund managers.",
                color: C.purple,
                features: ["50 enterprise clients = $1.5M ARR", "/api/v1/exhaust endpoint built", "60 req/hr Bearer auth"],
              },
              {
                tier: "AFFILIATE", title: "OPERATOR REFERRALS",
                price: "$200", unit: "/CPA",
                desc: "Licensed referrals to DraftKings, BetMGM, FanDuel via official affiliate programs.",
                color: C.gold,
                features: ["~$80 avg CPA across operators", "200K conversions = $16M", "No app store policy conflict"],
              },
            ].map(s => (
              <div key={s.tier} className="feature-card" style={{ padding: 32, borderRadius: 4, background: "rgba(13,30,42,0.5)", backdropFilter: "blur(8px)", border: `1.5px solid ${s.color}`, boxShadow: `0 0 24px ${s.color}33` }}>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, letterSpacing: 2, color: s.color, marginBottom: 8 }}>{s.tier}</div>
                <h3 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 18, letterSpacing: 1.5, color: C.text, marginBottom: 16 }}>{s.title}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 36, color: s.color, textShadow: `0 0 8px ${s.color}` }}>{s.price}</span>
                  <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 12, color: C.textMuted }}>{s.unit}</span>
                </div>
                <p style={{ fontFamily: "'Rajdhani'", fontSize: 14, color: C.textSec, lineHeight: 1.5, marginBottom: 20 }}>{s.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: s.color, fontSize: 10, marginTop: 2 }}>▸</span>
                      <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, color: C.textSec, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Projection */}
          <div className="glass" style={{ marginTop: 40, padding: 32, borderRadius: 4, border: `1px solid rgba(34,197,94,0.3)` }}>
            <h3 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 14, letterSpacing: 2, color: C.green, marginBottom: 20 }}>5-YEAR REVENUE PROJECTION</h3>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 160, marginBottom: 16 }}>
              {[
                { yr: "Y1", rev: "$0.4M", height: 12 },
                { yr: "Y2", rev: "$2.1M", height: 28 },
                { yr: "Y3", rev: "$8.5M", height: 52 },
                { yr: "Y4", rev: "$18M", height: 76 },
                { yr: "Y5", rev: "$32M", height: 100 },
              ].map(y => (
                <div key={y.yr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 14, color: C.cyanBright, textShadow: `0 0 6px ${C.cyan}` }}>{y.rev}</div>
                  <div style={{
                    width: "70%", height: `${y.height}%`,
                    background: `linear-gradient(180deg, ${C.cyanGlow}, ${C.cyan} 60%, ${C.cyanDim || "#0891b2"})`,
                    borderRadius: "2px 2px 0 0",
                    boxShadow: `0 0 12px ${C.cyan}88, 0 0 24px ${C.cyan}44`,
                  }} />
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 10, letterSpacing: 1, color: C.textMuted }}>{y.yr}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: C.textMuted, textAlign: "center", marginTop: 16 }}>Conservative model: Subscription + B2B + Affiliate combined</p>
          </div>
        </div>
      </section>

      {/* ═══ TRACTION / TECHNOLOGY ═══ */}
      <section className="section reveal" style={{ padding: "100px 32px", background: "linear-gradient(180deg, transparent, rgba(6,182,212,0.04), transparent)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.cyan, marginBottom: 12 }}>▸ WHAT'S BUILT ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 48, letterSpacing: 2, marginBottom: 48, lineHeight: 1.1 }}>
            TECHNOLOGY MOAT
          </h2>

          <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {[
              { metric: "8 / 10", label: "PANELS COMPLETE", desc: "All core screens built in React Native (Expo)" },
              { metric: "5", label: "PRIORITY GAMES", desc: "Buffalo Gold, Dragon Link, Lightning Link, Divine Fortune, 88 Fortunes" },
              { metric: "3", label: "SENTINEL AGENTS", desc: "Stealth scrapers w/ Playwright + fingerprint rotation" },
              { metric: "7", label: "ALERT TYPES", desc: "Vulture, Advantage, Hot, Reversal, Crew, Jackpot, Level-Up" },
              { metric: "4", label: "PLATFORMS COVERED", desc: "DraftKings, BetMGM, FanDuel, Caesars" },
              { metric: "180s", label: "SCAN INTERVAL", desc: "High-velocity tier; 30min low-velocity tier" },
            ].map(t => (
              <div key={t.label} className="feature-card glass" style={{ padding: 24, borderRadius: 4, border: `1px solid rgba(6,182,212,0.2)`, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ minWidth: 100 }}>
                  <div className="neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{t.metric}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 11, letterSpacing: 2, color: C.cyanBright, marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontFamily: "'Rajdhani'", fontSize: 14, color: C.textSec, lineHeight: 1.4 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE ASK ═══ */}
      <section id="contact" className="section reveal" style={{ padding: "100px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 11, letterSpacing: 4, color: C.green, marginBottom: 12 }}>▸ THE ASK ◂</div>
          <h2 className="section-title neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 56, letterSpacing: 2, marginBottom: 24, lineHeight: 1.1 }}>
            $1.5M SEED
          </h2>
          <p style={{ fontFamily: "'Rajdhani'", fontSize: 18, color: C.textSec, marginBottom: 48, lineHeight: 1.5 }}>
            18-month runway to launch in NJ + PA, validate the subscription model, secure operator affiliate partnerships, and prepare Series A.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 48 }} className="feature-grid">
            {[
              { pct: "40%", use: "Engineering", detail: "Senior RN dev, backend engineer, ML/data engineer" },
              { pct: "25%", use: "Legal & Compliance", detail: "Gaming counsel, state licensing, T&C review" },
              { pct: "20%", use: "Sentinel Infrastructure", detail: "Cloud compute, proxy network, data storage" },
              { pct: "15%", use: "Acquisition", detail: "Affiliate marketing, content, app store ASO" },
            ].map(u => (
              <div key={u.use} className="glass" style={{ padding: 20, borderRadius: 4, border: `1px solid rgba(6,182,212,0.2)`, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span className="neon-text-cyan" style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 28 }}>{u.pct}</span>
                  <span style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 12, letterSpacing: 2, color: C.cyanBright }}>{u.use}</span>
                </div>
                <div style={{ fontFamily: "'Rajdhani'", fontSize: 13, color: C.textSec }}>{u.detail}</div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: 40, borderRadius: 4, border: `1.5px solid ${C.cyan}`, boxShadow: `0 0 32px rgba(6,182,212,0.4)` }}>
            <h3 style={{ fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 14, letterSpacing: 2, color: C.cyanBright, marginBottom: 24 }}>BOOK A DEMO</h3>
            <p style={{ fontFamily: "'Rajdhani'", fontSize: 16, color: C.textSec, marginBottom: 24 }}>
              Founders are seeking introductions to seed investors with experience in fintech, gaming, or consumer subscription apps.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button className="hero-cta" onClick={() => window.location.href = "mailto:demo@syndicateledger.io"}>
                REQUEST INVESTOR DECK
              </button>
              <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 10, color: C.textMuted, letterSpacing: 1.5, marginTop: 8 }}>
                ◈ demo@syndicateledger.io
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 32px", borderTop: `1px solid rgba(6,182,212,0.15)`, position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.cyan, fontSize: 14 }}>◈</span>
            <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 11, letterSpacing: 3, color: C.cyanBright }}>SYNDICATE LEDGER</span>
            <span style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, color: C.textMuted, marginLeft: 12 }}>© 2026 — DEMO BUILD v1.0</span>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>
            For investor evaluation only · Not for public distribution · 21+ only · Gamble responsibly
          </div>
        </div>
      </footer>
    </>
  );
}
