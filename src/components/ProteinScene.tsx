"use client";

import { useEffect, useRef } from "react";

/**
 * Rotating protein scene: a three-helix bundle traced through Cα positions with
 * a small ligand docked in the pocket, projected with a real perspective camera
 * and painted back-to-front so depth reads correctly.
 *
 * Everything is drawn on one canvas — no 3D library, no model download.
 */

type Vec3 = { x: number; y: number; z: number };

type Atom = Vec3 & {
  r: number;
  hue: number;
  /** ligand atoms glow; backbone atoms are matte */
  ligand: boolean;
};

type Bond = [number, number];

const TAU = Math.PI * 2;

/** Points along an ideal α-helix, then bent into a bundle by a per-helix frame. */
function buildHelix(
  turns: number,
  radius: number,
  rise: number,
  samples: number,
  origin: Vec3,
  tilt: number,
): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / (samples - 1)) * turns * TAU;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = (i / (samples - 1) - 0.5) * rise;
    // tilt the helix axis so the bundle looks packed rather than parallel
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    pts.push({
      x: origin.x + x * ct - y * st,
      y: origin.y + x * st + y * ct,
      z: origin.z + z,
    });
  }
  return pts;
}

function buildScene() {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const strands: number[][] = [];

  const helices = [
    { origin: { x: -46, y: 0, z: -18 }, tilt: 0.16, turns: 4.2, hue: 205 },
    { origin: { x: 8, y: 6, z: 26 }, tilt: -0.2, turns: 4.8, hue: 194 },
    { origin: { x: 52, y: -4, z: -8 }, tilt: 0.1, turns: 3.8, hue: 214 },
  ];

  for (const h of helices) {
    const pts = buildHelix(h.turns, 21, 172, 34, h.origin, h.tilt);
    const idx: number[] = [];
    for (const p of pts) {
      idx.push(atoms.length);
      atoms.push({ ...p, r: 3.1, hue: h.hue, ligand: false });
    }
    for (let i = 0; i < idx.length - 1; i++) bonds.push([idx[i], idx[i + 1]]);
    strands.push(idx);
  }

  // Ligand: a compact ring system sitting in the pocket between helices 1 and 2
  const ligandCentre: Vec3 = { x: -18, y: 4, z: 6 };
  const ligandIdx: number[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    ligandIdx.push(atoms.length);
    atoms.push({
      x: ligandCentre.x + Math.cos(a) * 12,
      y: ligandCentre.y + Math.sin(a) * 8,
      z: ligandCentre.z + Math.sin(a) * 9,
      r: 5.2,
      hue: 158,
      ligand: true,
    });
  }
  for (let i = 0; i < 6; i++) {
    bonds.push([ligandIdx[i], ligandIdx[(i + 1) % 6]]);
  }
  // two substituents off the ring
  for (const [anchor, dx, dy, dz] of [
    [0, 16, 9, 4],
    [3, -15, -10, -6],
  ] as const) {
    ligandIdx.push(atoms.length);
    const a = atoms[ligandIdx[anchor]];
    atoms.push({ x: a.x + dx, y: a.y + dy, z: a.z + dz, r: 4.4, hue: 150, ligand: true });
    bonds.push([ligandIdx[anchor], atoms.length - 1]);
  }

  return { atoms, bonds, strands, ligandIdx };
}

export default function ProteinScene({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scene = buildScene();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let angle = -0.35;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (p: Vec3, cos: number, sin: number) => {
      // rotate about Y, then a fixed tilt about X for a three-quarter view
      const rx = p.x * cos - p.z * sin;
      const rz = p.x * sin + p.z * cos;
      const ry = p.y * 0.94 - rz * 0.18;
      const dz = rz * 0.94 + p.y * 0.18;
      const persp = 520 / (520 + dz);
      const scale = Math.min(width, height) / 300;
      return {
        x: width / 2 + rx * persp * scale,
        y: height / 2 + ry * persp * scale,
        depth: dz,
        persp,
      };
    };

    const draw = (now: number) => {
      const dt = Math.min(now - last, 60);
      last = now;
      if (!reduced) angle += dt * 0.00016;

      ctx.clearRect(0, 0, width, height);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const flat = scene.atoms.map((a) => project(a, cos, sin));

      // ── Ribbon: a smooth stroke through each helix, depth-shaded ──────────
      for (const strand of scene.strands) {
        for (let i = 0; i < strand.length - 1; i++) {
          const a = flat[strand[i]];
          const b = flat[strand[i + 1]];
          const t = (a.depth + 90) / 180;
          const alpha = 0.18 + Math.max(0, Math.min(1, t)) * 0.5;
          ctx.strokeStyle = `hsla(203, 90%, ${52 + t * 22}%, ${alpha})`;
          ctx.lineWidth = 5.5 * a.persp;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // ── Atoms & bonds, painted far-to-near ───────────────────────────────
      const order = scene.atoms
        .map((_, i) => i)
        .sort((p, q) => flat[p].depth - flat[q].depth);

      ctx.lineCap = "round";
      for (const [i, j] of scene.bonds) {
        const a = flat[i];
        const b = flat[j];
        if (!scene.atoms[i].ligand) continue;
        ctx.strokeStyle = `hsla(158, 70%, 62%, 0.55)`;
        ctx.lineWidth = 2.4 * a.persp;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const i of order) {
        const atom = scene.atoms[i];
        const p = flat[i];
        const t = Math.max(0, Math.min(1, (p.depth + 90) / 180));
        const r = atom.r * p.persp * (Math.min(width, height) / 300);
        if (r <= 0.2) continue;

        if (atom.ligand) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.4);
          halo.addColorStop(0, `hsla(${atom.hue}, 85%, 62%, 0.34)`);
          halo.addColorStop(1, "hsla(158, 85%, 60%, 0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.4, 0, TAU);
          ctx.fill();
        }

        const g = ctx.createRadialGradient(
          p.x - r * 0.35,
          p.y - r * 0.4,
          r * 0.1,
          p.x,
          p.y,
          r,
        );
        const light = atom.ligand ? 74 : 46 + t * 26;
        g.addColorStop(0, `hsla(${atom.hue}, 92%, ${light + 18}%, ${0.55 + t * 0.45})`);
        g.addColorStop(1, `hsla(${atom.hue}, 78%, ${light - 22}%, ${0.4 + t * 0.5})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, TAU);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    // Stop burning frames when the hero scrolls away or the tab is hidden
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Animated three-dimensional protein helix bundle with a small-molecule ligand bound in the pocket"
    />
  );
}
