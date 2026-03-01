"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string;
}

const GW = 10, GH = 7, NA = 5;
const HB = GW * GH;
const NS = HB + GW * GH * 9;

const ALPHA_DEFAULT = 0.15, GAMMA = 0.95;
const EPS0 = 1.0, EPS_DECAY = 0.985, EPS_MIN = 0.01;
const MAX_STEPS = 200, TICK = 80, STEAL_CD = 5;

const DX = [0, 0, -1, 1, 0];
const DY = [-1, 1, 0, 0, 0];

const SPEEDS = [1, 5, 10, 20];
type Mode = "train" | "play";
const GAME_KEYS = new Set(["w", "a", "s", "d", " ", "arrowup", "arrowdown", "arrowleft", "arrowright"]);

const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function skillLabel(r: number) {
  if (r >= 80) return "World Class";
  if (r >= 60) return "Professional";
  if (r >= 40) return "Semi-Pro";
  if (r >= 20) return "Amateur";
  return "Beginner";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RLSoccerGame({ className }: { className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [episode, setEpisode] = useState(0);
  const [goals, setGoals] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [epsUI, setEpsUI] = useState(EPS0);
  const [alphaUI, setAlphaUI] = useState(ALPHA_DEFAULT);
  const [mode, setMode] = useState<Mode>("train");
  const [spdIdx, setSpdIdx] = useState(0);
  const [score, setScore] = useState({ agent: 0, you: 0 });
  const [isFS, setIsFS] = useState(false);
  const [entropy, setEntropy] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [avgReward, setAvgReward] = useState(0);

  const qRef = useRef(new Float32Array(NS * NA));
  const epsRef = useRef(EPS0);
  const alphaRef = useRef(ALPHA_DEFAULT);
  const epRef = useRef(0);
  const glRef = useRef(0);
  const recentRef = useRef<boolean[]>([]);
  const spdRef = useRef(1);
  const rafRef = useRef(0);
  const modeRef = useRef<Mode>("train");
  const scoreRef = useRef({ agent: 0, you: 0 });

  const arRef = useRef(3), acRef = useRef(1), adRef = useRef(3);
  const stepRef = useRef(0);

  const bxRef = useRef(0), byRef = useRef(0);
  const bvxRef = useRef(0), bvyRef = useRef(0);
  const holdRef = useRef<"agent" | "player" | "bot" | null>(null);
  const acdRef = useRef(0), pcdRef = useRef(0);

  // Rules-based training bot
  const botRRef = useRef(3), botCRef = useRef(GW - 2);
  const botCdRef = useRef(0);
  const botTickRef = useRef(0);

  const pxRef = useRef(0), pyRef = useRef(0);
  const pdxRef = useRef(-1), pdyRef = useRef(0);
  const pTrailRef = useRef<{ x: number; y: number }[]>([]);

  const keysRef = useRef(new Set<string>());
  const kickRef = useRef(false);

  const avxRef = useRef(0), avyRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const fgRef = useRef(0), frRef = useRef(0);

  const wRef = useRef(0), hRef = useRef(0);
  const epRewRef = useRef(0);
  const recentRewRef = useRef<number[]>([]);

  /* ---- state encoding -------------------------------------------- */

  const enc = useCallback((ar: number, ac: number, has: boolean, br: number, bc: number) => {
    const p = ar * GW + ac;
    if (has) return p;
    return HB + p * 9 + (cl(bc - ac, -1, 1) + 1) * 3 + (cl(br - ar, -1, 1) + 1);
  }, []);

  /* ---- Q helpers ------------------------------------------------- */

  const qG = useCallback((s: number, a: number) => qRef.current[s * NA + a], []);
  const qP = useCallback((s: number, a: number, v: number) => { qRef.current[s * NA + a] = v; }, []);
  const bA = useCallback((s: number) => {
    let ba = 0, bv = qG(s, 0), allZero = true;
    for (let a = 0; a < NA; a++) { const v = qG(s, a); if (v !== 0) allZero = false; if (a === 0 || v > bv) { bv = v; ba = a; } }
    if (allZero) return Math.floor(Math.random() * NA);
    return ba;
  }, [qG]);
  const pA = useCallback((s: number, ex: boolean) => {
    if (ex && Math.random() < epsRef.current) return Math.floor(Math.random() * NA);
    if (!ex && Math.random() < 0.03) return Math.floor(Math.random() * NA);
    return bA(s);
  }, [bA]);

  /* ---- reset ----------------------------------------------------- */

  const resetEp = useCallback(() => {
    arRef.current = Math.floor(Math.random() * GH);
    acRef.current = Math.floor(Math.random() * Math.floor(GW / 2));
    adRef.current = 3; stepRef.current = 0;
    bvxRef.current = 0; bvyRef.current = 0;
    holdRef.current = null; acdRef.current = 0; pcdRef.current = 0;
    botCdRef.current = 0; botTickRef.current = 0;
    botRRef.current = Math.floor(Math.random() * GH);
    botCRef.current = GW - 1 - Math.floor(Math.random() * 3);
    const cw = wRef.current / GW, ch = hRef.current / GH;
    bxRef.current = wRef.current * (0.3 + Math.random() * 0.4);
    byRef.current = hRef.current * (0.2 + Math.random() * 0.6);
    avxRef.current = (acRef.current + 0.5) * cw;
    avyRef.current = (arRef.current + 0.5) * ch;
    trailRef.current = [];
    if (modeRef.current === "play") {
      pxRef.current = wRef.current * 0.8; pyRef.current = hRef.current * 0.5;
      pTrailRef.current = [];
    }
    epRewRef.current = 0;
  }, []);

  const burst = useCallback((x: number, y: number, cols: string[]) => {
    for (let i = 0; i < 35; i++) {
      const a = Math.random() * Math.PI * 2, s = Math.random() * 3 + 1;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, maxLife: 1, color: cols[Math.floor(Math.random() * cols.length)] });
    }
    if (particlesRef.current.length > 100) particlesRef.current = particlesRef.current.slice(-100);
  }, []);

  /* ---- controls -------------------------------------------------- */

  const handleReset = useCallback(() => {
    qRef.current = new Float32Array(NS * NA);
    epsRef.current = EPS0; alphaRef.current = ALPHA_DEFAULT;
    epRef.current = 0; glRef.current = 0;
    recentRef.current = []; scoreRef.current = { agent: 0, you: 0 };
    recentRewRef.current = [];
    resetEp();
    setEpisode(0); setGoals(0); setSuccessRate(0); setEpsUI(EPS0);
    setAlphaUI(ALPHA_DEFAULT);
    setScore({ agent: 0, you: 0 }); setEntropy(0); setCoverage(0); setAvgReward(0);
  }, [resetEp]);

  const handleSpeed = useCallback((i: number) => { setSpdIdx(i); spdRef.current = SPEEDS[i]; }, []);

  const handleMode = useCallback(() => {
    const n: Mode = modeRef.current === "train" ? "play" : "train";
    modeRef.current = n; setMode(n);
    if (n === "play") { spdRef.current = 1; setSpdIdx(0); scoreRef.current = { agent: 0, you: 0 }; setScore({ agent: 0, you: 0 }); }
    resetEp();
  }, [resetEp]);

  const toggleFS = useCallback(() => {
    if (!outerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else outerRef.current.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  /* ---- keyboard (preventDefault for game keys in play mode) ------ */

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (modeRef.current === "play" && GAME_KEYS.has(k)) {
        e.preventDefault();
        if (k === " ") kickRef.current = true;
      }
      keysRef.current.add(k);
    };
    const up = (e: KeyboardEvent) => { keysRef.current.delete(e.key.toLowerCase()); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  /* ---- slider handlers ------------------------------------------- */

  const handleAlpha = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    alphaRef.current = v; setAlphaUI(v);
  }, []);

  const handleEps = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    epsRef.current = v; setEpsUI(v);
  }, []);

  /* ---- main loop ------------------------------------------------- */

  useEffect(() => {
    const cvs = canvasRef.current, ctr = containerRef.current;
    if (!cvs || !ctr) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const r = ctr.getBoundingClientRect(), d = devicePixelRatio || 1;
      cvs.width = r.width * d; cvs.height = r.height * d;
      cvs.style.width = `${r.width}px`; cvs.style.height = `${r.height}px`;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      wRef.current = r.width; hRef.current = r.height;
    };
    const obs = new ResizeObserver(resize);
    obs.observe(ctr); resize(); resetEp();
    pxRef.current = wRef.current * 0.8; pyRef.current = hRef.current * 0.5;

    let epDone = true, prevDB = Infinity, prevDG = Infinity;

    const startEp = () => {
      epRef.current++;
      if (modeRef.current === "train") epsRef.current = Math.max(EPS_MIN, epsRef.current * EPS_DECAY);
      resetEp(); epDone = false; prevDB = Infinity; prevDG = Infinity;
    };

    const step = () => {
      const w = wRef.current, h = hRef.current;
      if (!w || !h) return;
      const cw = w / GW, ch = h / GH;
      const grs = Math.floor(GH * 0.35), gre = Math.ceil(GH * 0.65);
      const gt = grs * ch, gb = (gre + 1) * ch;
      const isP = modeRef.current === "play";

      if (acdRef.current > 0) acdRef.current--;
      if (pcdRef.current > 0) pcdRef.current--;
      if (botCdRef.current > 0) botCdRef.current--;

      /* --- Agent action --- */
      const bgc = cl(Math.floor(bxRef.current / cw), 0, GW - 1);
      const bgr = cl(Math.floor(byRef.current / ch), 0, GH - 1);
      const hb = holdRef.current === "agent";
      const st = enc(arRef.current, acRef.current, hb, bgr, bgc);
      const act = pA(st, !isP);
      if (act < 4) adRef.current = act;

      let rew = -0.1;
      let nr = arRef.current + DY[act], nc = acRef.current + DX[act];
      if (act === 4) { nr = arRef.current; nc = acRef.current; }
      if (nr < 0 || nr >= GH || nc < 0 || nc >= GW) { rew -= 3; nr = arRef.current; nc = acRef.current; }
      arRef.current = nr; acRef.current = nc;
      const ax = (nc + 0.5) * cw, ay = (nr + 0.5) * ch;

      /* --- Rules-based bot (scales with skill) --- */
      if (!isP) {
        botTickRef.current++;
        const recent = recentRef.current;
        const rate = recent.length > 0 ? recent.filter(Boolean).length / recent.length : 0;

        // How often the bot acts (lower = more frequent = harder)
        const actEvery = rate < 0.2 ? 5 : rate < 0.4 ? 3 : rate < 0.6 ? 2 : 1;
        // Chase range: how far from its goal the bot will chase
        const chaseRange = rate < 0.2 ? 3 : rate < 0.4 ? 5 : GW;

        if (botTickRef.current % actEvery === 0) {
          const ballC = cl(Math.floor(bxRef.current / cw), 0, GW - 1);
          const ballR = cl(Math.floor(byRef.current / ch), 0, GH - 1);

          // Decide target: chase ball or retreat to defensive position
          let tgtR = botRRef.current, tgtC = botCRef.current;
          const distFromGoal = GW - 1 - ballC;
          if (distFromGoal <= chaseRange && holdRef.current !== "bot") {
            // Chase ball
            tgtR = ballR; tgtC = ballC;
          } else {
            // Retreat toward right-center (defensive position)
            tgtR = Math.floor(GH / 2);
            tgtC = GW - 2;
          }

          // Move one step toward target
          let dr = Math.sign(tgtR - botRRef.current);
          let dc = Math.sign(tgtC - botCRef.current);
          // Prefer horizontal movement for interception
          if (dc !== 0 && Math.random() < 0.6) dr = 0;
          else if (dr !== 0) dc = 0;
          const nr = cl(botRRef.current + dr, 0, GH - 1);
          const nc = cl(botCRef.current + dc, 0, GW - 1);
          botRRef.current = nr; botCRef.current = nc;
        }

        const botX = (botCRef.current + 0.5) * cw, botY = (botRRef.current + 0.5) * ch;
        const botGrab = cw * 0.7;
        const botDist = Math.hypot(botX - bxRef.current, botY - byRef.current);

        // Bot steal
        if (botDist < botGrab && botCdRef.current === 0 && holdRef.current !== "bot") {
          if (holdRef.current === "agent") { acdRef.current = STEAL_CD; rew -= 8; }
          holdRef.current = "bot";
          bxRef.current = botX; byRef.current = botY;
        }

        // Bot kick — away from right goal (toward left)
        if (holdRef.current === "bot" && botTickRef.current % actEvery === 0) {
          holdRef.current = null; botCdRef.current = STEAL_CD;
          const pwr = cw * (0.3 + rate * 0.4);
          // Kick toward left goal at higher skill, just clear it at lower skill
          const kickAngle = rate < 0.4 ? (Math.random() - 0.5) * Math.PI : 0;
          const goalX = cw * 0.25, goalY = h / 2;
          const kdx = goalX - botX, kdy = goalY - botY;
          const klen = Math.hypot(kdx, kdy) || 1;
          const cos = Math.cos(kickAngle), sin = Math.sin(kickAngle);
          bvxRef.current = ((kdx / klen) * cos - (kdy / klen) * sin) * pwr;
          bvyRef.current = ((kdx / klen) * sin + (kdy / klen) * cos) * pwr;
        }

        // Bot ball carry
        if (holdRef.current === "bot") { bxRef.current = botX; byRef.current = botY; bvxRef.current = 0; bvyRef.current = 0; }
      }

      /* --- Ball physics --- */
      const grab = cw * 0.7;
      if (holdRef.current === "agent") { bxRef.current = ax; byRef.current = ay; bvxRef.current = 0; bvyRef.current = 0; }
      else if (holdRef.current === "player") { bxRef.current = pxRef.current; byRef.current = pyRef.current; bvxRef.current = 0; bvyRef.current = 0; }
      else if (holdRef.current !== "bot") {
        bvxRef.current *= 0.92; bvyRef.current *= 0.92;
        if (Math.abs(bvxRef.current) < 0.08) bvxRef.current = 0;
        if (Math.abs(bvyRef.current) < 0.08) bvyRef.current = 0;
        bxRef.current += bvxRef.current; byRef.current += bvyRef.current;
        if (byRef.current <= 0) { byRef.current = 1; bvyRef.current = Math.abs(bvyRef.current) * 0.7; }
        if (byRef.current >= h) { byRef.current = h - 1; bvyRef.current = -Math.abs(bvyRef.current) * 0.7; }
        const inGoalZone = byRef.current >= gt && byRef.current <= gb;
        if (bxRef.current <= 0 && !inGoalZone) { bxRef.current = 1; bvxRef.current = Math.abs(bvxRef.current) * 0.7; }
        if (bxRef.current >= w && !inGoalZone) { bxRef.current = w - 1; bvxRef.current = -Math.abs(bvxRef.current) * 0.7; }
        bxRef.current = cl(bxRef.current, 0, w); byRef.current = cl(byRef.current, 0, h);
      }

      const agentDist = Math.hypot(ax - bxRef.current, ay - byRef.current);
      const playerDist = isP ? Math.hypot(pxRef.current - bxRef.current, pyRef.current - byRef.current) : Infinity;

      // Agent pickup
      if (agentDist < grab && acdRef.current === 0 && holdRef.current !== "agent") {
        if (holdRef.current === "player") pcdRef.current = STEAL_CD;
        if (holdRef.current === "bot") botCdRef.current = STEAL_CD;
        holdRef.current = "agent"; rew += 5;
        bxRef.current = ax; byRef.current = ay;
      }
      // Player pickup/steal (play mode)
      if (isP && playerDist < grab && pcdRef.current === 0 && holdRef.current !== "player") {
        if (holdRef.current === "agent") { acdRef.current = STEAL_CD; rew -= 10; }
        holdRef.current = "player";
        bxRef.current = pxRef.current; byRef.current = pyRef.current;
      }

      // Agent kick — TOWARD RIGHT GOAL CENTER
      if (act === 4 && holdRef.current === "agent") {
        rew += 3; holdRef.current = null; acdRef.current = STEAL_CD;
        const pwr = cw * 0.7;
        const goalX = w - cw * 0.25;
        const goalY = ((grs + gre + 1) / 2) * ch;
        const kdx = goalX - ax, kdy = goalY - ay;
        const klen = Math.hypot(kdx, kdy) || 1;
        bvxRef.current = (kdx / klen) * pwr;
        bvyRef.current = (kdy / klen) * pwr;
      } else if (act === 4 && holdRef.current !== "agent") { rew -= 1; }

      // Player kick — in facing direction (WASD)
      if (isP && kickRef.current && holdRef.current === "player") {
        holdRef.current = null; pcdRef.current = STEAL_CD;
        const pwr = cw * 0.75;
        const dx = pdxRef.current, dy = pdyRef.current;
        const len = Math.hypot(dx, dy) || 1;
        bvxRef.current = (dx / len) * pwr;
        bvyRef.current = (dy / len) * pwr;
      }
      kickRef.current = false;

      // Reward shaping
      if (holdRef.current !== "agent") {
        const d = Math.hypot(ax - bxRef.current, ay - byRef.current);
        if (prevDB < Infinity) { if (d < prevDB) rew += 1; else if (d > prevDB) rew -= 0.5; }
        prevDB = d;
      } else { prevDB = 0; }

      const gx = w - cw * 0.5, gd = Math.abs(bxRef.current - gx);
      if (prevDG < Infinity) { if (gd < prevDG) rew += 2; else if (gd > prevDG) rew -= 1; }
      prevDG = gd;

      epRewRef.current += rew;

      // Goals
      let aScored = false, pScored = false;
      const bc = cl(Math.floor(bxRef.current / cw), 0, GW - 1);
      const br = cl(Math.floor(byRef.current / ch), 0, GH - 1);

      // Right goal — agent scores
      if (bc >= GW - 1 && br >= grs && br <= gre) {
        aScored = true; rew += 100; glRef.current++;
        if (isP) { scoreRef.current.agent++; setScore({ ...scoreRef.current }); }
        fgRef.current = 1;
        burst(w - cw * 0.25, ((grs + gre) / 2) * ch, ["#fbbf24", "#00e87b", "#fff"]);
      }
      // Left goal — opponent scores (play mode: player, train mode: bot)
      if (bc <= 0 && br >= grs && br <= gre) {
        if (isP) { pScored = true; scoreRef.current.you++; setScore({ ...scoreRef.current }); }
        else { pScored = true; } // bot scored — end episode as failure
        rew -= 50;
        frRef.current = 1;
        burst(cw * 0.25, ((grs + gre) / 2) * ch, ["#ff5f57", "#ff8a80", "#fff"]);
      }

      // Q update for main agent
      {
        const nbc = cl(Math.floor(bxRef.current / cw), 0, GW - 1);
        const nbr = cl(Math.floor(byRef.current / ch), 0, GH - 1);
        const ns = enc(nr, nc, holdRef.current === "agent", nbr, nbc);
        const oq = qG(st, act);
        const mfq = aScored ? 0 : qG(ns, bA(ns));
        qP(st, act, oq + alphaRef.current * (rew + GAMMA * mfq - oq));
      }

      stepRef.current++;
      if (aScored || pScored || stepRef.current >= MAX_STEPS) {
        recentRef.current.push(aScored);
        if (recentRef.current.length > 50) recentRef.current.shift();
        recentRewRef.current.push(epRewRef.current);
        if (recentRewRef.current.length > 50) recentRewRef.current.shift();
        epDone = true;
      }
    };

    // Stats sync
    const si = setInterval(() => {
      const r = recentRef.current;
      const rate = r.length > 0 ? Math.round((r.filter(Boolean).length / r.length) * 100) : 0;
      setEpisode(epRef.current); setGoals(glRef.current);
      setSuccessRate(rate); setEpsUI(epsRef.current);
      setAlphaUI(alphaRef.current);

      const qt = qRef.current;
      let totEnt = 0, vis = 0;
      for (let s = 0; s < NS; s++) {
        let hasQ = false, mx = -Infinity;
        for (let a = 0; a < NA; a++) { const v = qt[s * NA + a]; if (v !== 0) hasQ = true; if (v > mx) mx = v; }
        if (!hasQ) continue;
        vis++;
        let sum = 0;
        const exps = new Float32Array(NA);
        for (let a = 0; a < NA; a++) { exps[a] = Math.exp(qt[s * NA + a] - mx); sum += exps[a]; }
        let ent = 0;
        for (let a = 0; a < NA; a++) { const p = exps[a] / sum; if (p > 0) ent -= p * Math.log2(p); }
        totEnt += ent;
      }
      setEntropy(vis > 0 ? +(totEnt / vis).toFixed(2) : +(Math.log2(NA)).toFixed(2));
      setCoverage(+(((vis / NS) * 100).toFixed(1)));

      const rr = recentRewRef.current;
      setAvgReward(rr.length > 0 ? +(rr.reduce((a, b) => a + b, 0) / rr.length).toFixed(1) : 0);
    }, 500);

    // Render loop
    let lastT = 0, tickAcc = 0;

    const render = (t: number) => {
      const dt = lastT ? t - lastT : 16; lastT = t;
      const w = wRef.current, h = hRef.current;
      if (!w || !h) { rafRef.current = requestAnimationFrame(render); return; }
      const cw = w / GW, ch = h / GH;
      const isP = modeRef.current === "play";

      // Player WASD movement (per frame for responsiveness)
      if (isP) {
        const spd = cw * 4 * (dt / 1000);
        const keys = keysRef.current;
        let mx = 0, my = 0;
        if (keys.has("w") || keys.has("arrowup")) my -= 1;
        if (keys.has("s") || keys.has("arrowdown")) my += 1;
        if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
        if (keys.has("d") || keys.has("arrowright")) mx += 1;
        if (mx || my) {
          const len = Math.hypot(mx, my);
          pxRef.current += (mx / len) * spd;
          pyRef.current += (my / len) * spd;
          pxRef.current = cl(pxRef.current, 0, w);
          pyRef.current = cl(pyRef.current, 0, h);
          pdxRef.current = mx; pdyRef.current = my;
        }
      }

      // Tick stepping
      tickAcc += dt;
      if (tickAcc > TICK * 5) tickAcc = TICK * 5;
      while (tickAcc >= TICK) {
        tickAcc -= TICK;
        const spf = isP ? 1 : spdRef.current;
        for (let s = 0; s < spf; s++) { if (epDone) startEp(); step(); }
      }

      // Agent visual lerp
      const tax = (acRef.current + 0.5) * cw, tay = (arRef.current + 0.5) * ch;
      avxRef.current += (tax - avxRef.current) * 0.25;
      avyRef.current += (tay - avyRef.current) * 0.25;
      trailRef.current.push({ x: avxRef.current, y: avyRef.current });
      if (trailRef.current.length > 20) trailRef.current.shift();
      if (isP) {
        pTrailRef.current.push({ x: pxRef.current, y: pyRef.current });
        if (pTrailRef.current.length > 15) pTrailRef.current.shift();
      }

      /* ---- DRAW -------------------------------------------------- */
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0d3320"; ctx.fillRect(0, 0, w, h);

      // Q heatmap
      const qt = qRef.current;
      let gMax = 0;
      const cQ = new Float32Array(GW * GH);
      for (let r = 0; r < GH; r++) for (let c = 0; c < GW; c++) {
        const p = r * GW + c; let best = -Infinity;
        for (let a = 0; a < NA; a++) { const v = qt[p * NA + a]; if (v > best) best = v; }
        for (let rb = 0; rb < 9; rb++) { const idx = HB + p * 9 + rb; for (let a = 0; a < NA; a++) { const v = qt[idx * NA + a]; if (v > best) best = v; } }
        cQ[p] = Math.max(0, best); if (cQ[p] > gMax) gMax = cQ[p];
      }
      if (gMax > 0.5) for (let r = 0; r < GH; r++) for (let c = 0; c < GW; c++) {
        const i = cQ[r * GW + c] / gMax;
        if (i > 0.05) { ctx.fillStyle = `rgba(0,232,123,${i * 0.18})`; ctx.fillRect(c * cw, r * ch, cw, ch); }
      }

      // Pitch lines
      ctx.strokeStyle = "rgba(244,234,213,0.12)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.15, 0, Math.PI * 2); ctx.stroke();

      const grs = Math.floor(GH * 0.35), gre = Math.ceil(GH * 0.65);
      const gt = grs * ch, gb = (gre + 1) * ch;
      ctx.strokeStyle = "rgba(244,234,213,0.15)"; ctx.lineWidth = 1.5;
      ctx.strokeRect(w - cw * 1.5, gt, cw * 1.5, gb - gt);
      ctx.strokeRect(w - cw * 2.5, gt - ch, cw * 2.5, gb - gt + 2 * ch);
      ctx.strokeRect(0, gt, cw * 1.5, gb - gt);
      ctx.strokeRect(0, gt - ch, cw * 2.5, gb - gt + 2 * ch);

      // Goal posts
      ctx.lineWidth = 3;
      ctx.strokeStyle = fgRef.current > 0 ? `rgba(0,232,123,${0.4 + fgRef.current * 0.6})` : "rgba(244,234,213,0.35)";
      ctx.beginPath(); ctx.moveTo(w - 2, gt); ctx.lineTo(w - 2, gb); ctx.stroke();
      ctx.strokeStyle = frRef.current > 0 ? `rgba(255,95,87,${0.4 + frRef.current * 0.6})` : "rgba(244,234,213,0.25)";
      ctx.beginPath(); ctx.moveTo(2, gt); ctx.lineTo(2, gb); ctx.stroke();

      if (fgRef.current > 0) fgRef.current = Math.max(0, fgRef.current - 0.02);
      if (frRef.current > 0) frRef.current = Math.max(0, frRef.current - 0.025);
      if (fgRef.current > 0.5) { ctx.fillStyle = `rgba(0,232,123,${(fgRef.current - 0.5) * 0.15})`; ctx.fillRect(0, 0, w, h); }
      if (frRef.current > 0.5) { ctx.fillStyle = `rgba(255,95,87,${(frRef.current - 0.5) * 0.12})`; ctx.fillRect(0, 0, w, h); }

      // Trails
      for (let i = 0; i < trailRef.current.length; i++) {
        ctx.fillStyle = `rgba(0,232,123,${(i / trailRef.current.length) * 0.25})`;
        ctx.beginPath(); ctx.arc(trailRef.current[i].x, trailRef.current[i].y, cw * 0.08, 0, Math.PI * 2); ctx.fill();
      }
      if (isP) for (let i = 0; i < pTrailRef.current.length; i++) {
        ctx.fillStyle = `rgba(255,95,87,${(i / pTrailRef.current.length) * 0.18})`;
        ctx.beginPath(); ctx.arc(pTrailRef.current[i].x, pTrailRef.current[i].y, cw * 0.07, 0, Math.PI * 2); ctx.fill();
      }

      // Ball
      const bx = bxRef.current, by = byRef.current, ballR = Math.min(cw, ch) * 0.2;
      const bg = ctx.createRadialGradient(bx, by, 0, bx, by, ballR * 2.5);
      bg.addColorStop(0, "#fbbf24"); bg.addColorStop(0.4, "rgba(251,191,36,0.6)"); bg.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, ballR * 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(bx, by, ballR, 0, Math.PI * 2); ctx.fill();
      if (holdRef.current) {
        ctx.strokeStyle = holdRef.current === "agent" ? "rgba(0,232,123,0.6)" : holdRef.current === "bot" ? "rgba(139,92,246,0.6)" : "rgba(255,95,87,0.6)";
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, ballR + 3, 0, Math.PI * 2); ctx.stroke();
      }

      // Agent
      const avx = avxRef.current, avy = avyRef.current, agR = Math.min(cw, ch) * 0.26;
      const ag = ctx.createRadialGradient(avx, avy, 0, avx, avy, agR * 2.5);
      ag.addColorStop(0, "#00e87b"); ag.addColorStop(0.4, "rgba(0,232,123,0.5)"); ag.addColorStop(1, "rgba(0,232,123,0)");
      ctx.fillStyle = ag; ctx.beginPath(); ctx.arc(avx, avy, agR * 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#00e87b"; ctx.beginPath(); ctx.arc(avx, avy, agR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath();
      ctx.arc(avx + DX[adRef.current] * agR * 0.65, avy + DY[adRef.current] * agR * 0.65, agR * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = `bold ${Math.max(7, agR * 0.55)}px monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("AI", avx, avy);

      // Bot (training only)
      if (!isP) {
        const botX = (botCRef.current + 0.5) * cw, botY = (botRRef.current + 0.5) * ch;
        const bR = Math.min(cw, ch) * 0.24;
        const btg = ctx.createRadialGradient(botX, botY, 0, botX, botY, bR * 2.5);
        btg.addColorStop(0, "#8b5cf6"); btg.addColorStop(0.4, "rgba(139,92,246,0.5)"); btg.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = btg; ctx.beginPath(); ctx.arc(botX, botY, bR * 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#8b5cf6"; ctx.beginPath(); ctx.arc(botX, botY, bR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = `bold ${Math.max(7, bR * 0.55)}px monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("DF", botX, botY);
      }

      // Player
      if (isP) {
        const px = pxRef.current, py = pyRef.current, pr = Math.min(cw, ch) * 0.28;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, pr * 2.5);
        pg.addColorStop(0, "#ff5f57"); pg.addColorStop(0.4, "rgba(255,95,87,0.5)"); pg.addColorStop(1, "rgba(255,95,87,0)");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, pr * 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ff5f57"; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
        const dlen = Math.hypot(pdxRef.current, pdyRef.current) || 1;
        const adx = pdxRef.current / dlen, ady = pdyRef.current / dlen;
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath();
        ctx.arc(px + adx * pr * 0.65, py + ady * pr * 0.65, pr * 0.22, 0, Math.PI * 2); ctx.fill();
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.016;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const al = p.life / p.maxLife;
        ctx.fillStyle = p.color === "#fff" ? `rgba(255,255,255,${al})` : p.color === "#00e87b" ? `rgba(0,232,123,${al})` : p.color === "#ff5f57" ? `rgba(255,95,87,${al})` : p.color === "#ff8a80" ? `rgba(255,138,128,${al})` : `rgba(251,191,36,${al})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(si); obs.disconnect(); };
  }, [resetEp, pA, qG, qP, bA, burst, enc]);

  const skill = skillLabel(successRate);

  /* ---- JSX ------------------------------------------------------ */

  return (
    <div
      ref={outerRef}
      className={`pixel-card overflow-hidden ${className ?? ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "rgba(20, 38, 30, 0.92)",
        border: isFS ? "none" : "2px solid rgba(244, 234, 213, 0.5)",
        boxShadow: isFS ? "none" : "2px 2px 0 0 rgba(26, 48, 40, 0.6)",
        height: isFS ? "100vh" : undefined,
        width: isFS ? "100vw" : undefined,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ flexShrink: 0, borderBottom: "2px solid rgba(244, 234, 213, 0.15)", background: "rgba(15, 30, 22, 0.5)" }}
      >
        <span className="inline-block w-[10px] h-[10px]" style={{ background: "#ff5f57", boxShadow: "1px 1px 0 rgba(0,0,0,0.2)" }} />
        <span className="inline-block w-[10px] h-[10px]" style={{ background: "#ffbd2e", boxShadow: "1px 1px 0 rgba(0,0,0,0.2)" }} />
        <span className="inline-block w-[10px] h-[10px]" style={{ background: "#28c840", boxShadow: "1px 1px 0 rgba(0,0,0,0.2)" }} />
        <span className="ml-3 text-xs tracking-wider flex-1" style={{ color: "var(--muted)" }}>
          {mode === "train" ? "rl-agent ~ training" : "rl-agent ~ 1v1"}
        </span>
        <button onClick={toggleFS} className="text-[10px] font-mono px-2 py-0.5" style={{ background: "transparent", border: "1px solid rgba(244,234,213,0.15)", color: "var(--muted)", cursor: "pointer" }}>
          {isFS ? "Exit FS" : "Fullscreen"}
        </button>
      </div>

      {/* Instruction line */}
      <div
        className="px-4 py-1 text-[10px] font-mono text-center tracking-wide"
        style={{ flexShrink: 0, color: "rgba(244, 234, 213, 0.55)", background: "rgba(15, 30, 22, 0.3)" }}
      >
        Tune the learning rate &amp; exploration, train the agent, then challenge it 1v1
      </div>

      {/* Game canvas area */}
      <div ref={containerRef} className="relative" style={{ flex: "1 1 0%", minHeight: isFS ? 0 : 280 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Score/Stats overlay — top left */}
        <div className="absolute top-2 left-2 px-3 py-2 text-[10px] font-mono leading-relaxed pointer-events-none select-none"
          style={{ background: "rgba(15,30,22,0.8)", border: "1px solid rgba(244,234,213,0.12)", color: "var(--muted)" }}>
          {mode === "train" ? (
            <>
              <div>Episode: <span style={{ color: "var(--foreground)" }}>{episode}</span></div>
              <div>Goals: <span style={{ color: "#fbbf24" }}>{goals}</span></div>
              <div>Success: <span style={{ color: "#00e87b" }}>{successRate}%</span></div>
              <div>Skill: <span style={{ color: "var(--accent)" }}>{skill}</span></div>
            </>
          ) : (
            <div><span style={{ color: "#00e87b" }}>Agent</span> {score.agent} &ndash; {score.you} <span style={{ color: "#ff5f57" }}>You</span></div>
          )}
        </div>

        {/* WASD hint — bottom center (play mode) */}
        {mode === "play" && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[9px] font-mono"
            style={{ color: "rgba(244,234,213,0.3)" }}>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex gap-0.5">
                <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,234,213,0.15)", borderRadius: 2 }}>W</span>
              </div>
              <div className="flex gap-0.5">
                <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,234,213,0.15)", borderRadius: 2 }}>A</span>
                <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,234,213,0.15)", borderRadius: 2 }}>S</span>
                <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,234,213,0.15)", borderRadius: 2 }}>D</span>
              </div>
              <span style={{ marginTop: 2, padding: "2px 10px", border: "1px solid rgba(244,234,213,0.15)", borderRadius: 2, letterSpacing: "0.1em" }}>SPACE kick</span>
            </div>
          </div>
        )}

        {/* Epsilon bar (train) */}
        {mode === "train" && (
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: "rgba(15,30,22,0.6)" }}>
            <div style={{ height: "100%", width: `${(1 - epsUI) * 100}%`, background: "linear-gradient(90deg,#00e87b,rgba(0,232,123,0.3))", transition: "width 0.5s ease" }} />
          </div>
        )}
      </div>

      {/* Control bar — OUTSIDE the field, below canvas */}
      <div
        className="px-3 py-2 font-mono text-[10px] flex flex-wrap items-center gap-x-4 gap-y-1"
        style={{
          flexShrink: 0,
          borderTop: "2px solid rgba(244, 234, 213, 0.15)",
          background: "rgba(15, 30, 22, 0.6)",
          color: "var(--muted)",
        }}
      >
        {/* Mode + Speed + Reset */}
        <div className="flex items-center gap-1">
          <button onClick={handleMode} className="px-2 py-0.5 transition-colors"
            style={{ background: mode === "play" ? "rgba(255,95,87,0.2)" : "rgba(15,30,22,0.8)", border: mode === "play" ? "1px solid rgba(255,95,87,0.5)" : "1px solid rgba(244,234,213,0.12)", color: mode === "play" ? "#ff5f57" : "var(--muted)", cursor: "pointer" }}>
            {mode === "train" ? "1v1" : "Train"}
          </button>
          {mode === "train" && SPEEDS.map((s, i) => (
            <button key={s} onClick={() => handleSpeed(i)} className="px-2 py-0.5 transition-colors"
              style={{ background: i === spdIdx ? "rgba(0,232,123,0.25)" : "rgba(15,30,22,0.8)", border: i === spdIdx ? "1px solid rgba(0,232,123,0.5)" : "1px solid rgba(244,234,213,0.12)", color: i === spdIdx ? "#00e87b" : "var(--muted)", cursor: "pointer" }}>
              {s}x
            </button>
          ))}
          <button onClick={handleReset} className="px-2 py-0.5 transition-colors"
            style={{ background: "rgba(15,30,22,0.8)", border: "1px solid rgba(244,234,213,0.12)", color: "var(--muted)", cursor: "pointer" }}>
            Reset
          </button>
        </div>

        <div style={{ width: 1, height: 16, background: "rgba(244,234,213,0.1)" }} />

        {/* Alpha slider */}
        <div className="flex items-center gap-1">
          <span style={{ color: "rgba(244,234,213,0.5)" }}>&#945;</span>
          <input type="range" min="0.01" max="0.5" step="0.01" value={alphaUI}
            onChange={handleAlpha} style={{ width: 56, accentColor: "#00e87b", cursor: "pointer" }} />
          <span style={{ color: "var(--foreground)", minWidth: 28 }}>{alphaUI.toFixed(2)}</span>
        </div>

        {/* Epsilon slider */}
        <div className="flex items-center gap-1">
          <span style={{ color: "rgba(244,234,213,0.5)" }}>&#949;</span>
          <input type="range" min="0" max="1" step="0.01" value={epsUI}
            onChange={handleEps} style={{ width: 56, accentColor: "#00e87b", cursor: "pointer" }} />
          <span style={{ color: "#00e87b", minWidth: 34 }}>{epsUI.toFixed(3)}</span>
        </div>

        <div style={{ width: 1, height: 16, background: "rgba(244,234,213,0.1)" }} />

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <span><span style={{ color: "rgba(244,234,213,0.4)" }}>&#947;</span> {GAMMA}</span>
          <span><span style={{ color: "rgba(244,234,213,0.4)" }}>entropy</span> <span style={{ color: "#fbbf24" }}>{entropy}</span></span>
          <span><span style={{ color: "rgba(244,234,213,0.4)" }}>Q cov</span> <span style={{ color: "#8b5cf6" }}>{coverage}%</span></span>
          <span><span style={{ color: "rgba(244,234,213,0.4)" }}>avg rew</span> <span style={{ color: avgReward >= 0 ? "#00e87b" : "#ff5f57" }}>{avgReward}</span></span>
        </div>
      </div>
    </div>
  );
}
