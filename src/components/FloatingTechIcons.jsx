import { useEffect, useRef } from "react";

const drawTextIcon = (ctx, p, ic) => {
  ctx.font = `700 ${p.r * 0.62}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = ic.fg;
  ctx.fillText(ic.label, 0, p.r * 0.04);
};

const drawGithub = (ctx, p, ic) => {
  ctx.fillStyle = ic.fg;
  ctx.beginPath();
  ctx.arc(0, -p.r * 0.05, p.r * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-p.r * 0.3, -p.r * 0.34, p.r * 0.12, 0, Math.PI * 2);
  ctx.arc(p.r * 0.3, -p.r * 0.34, p.r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-p.r * 0.32, p.r * 0.18);
  ctx.quadraticCurveTo(0, p.r * 0.5, p.r * 0.32, p.r * 0.18);
  ctx.lineTo(p.r * 0.22, p.r * 0.02);
  ctx.lineTo(-p.r * 0.22, p.r * 0.02);
  ctx.closePath();
  ctx.fill();
};

const drawReact = (ctx, p, ic) => {
  ctx.strokeStyle = ic.fg;
  ctx.lineWidth = Math.max(1.5, p.r * 0.06);
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((Math.PI / 3) * i);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 0.5, p.r * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = ic.fg;
  ctx.beginPath();
  ctx.arc(0, 0, p.r * 0.09, 0, Math.PI * 2);
  ctx.fill();
};

const drawNext = (ctx, p, ic) => {
  ctx.fillStyle = ic.fg;
  ctx.font = `700 ${p.r * 0.62}px -apple-system, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", -p.r * 0.02, p.r * 0.04);
  ctx.strokeStyle = ic.fg;
  ctx.lineWidth = Math.max(1.5, p.r * 0.09);
  ctx.beginPath();
  ctx.moveTo(p.r * 0.12, -p.r * 0.32);
  ctx.lineTo(p.r * 0.12, p.r * 0.32);
  ctx.stroke();
};

const roundRectPath = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const drawPython = (ctx, p, ic) => {
  const s = p.r * 0.34;
  ctx.fillStyle = "#4b8bbe";
  roundRectPath(ctx, -s * 1.05, -s * 1.3, s * 1.9, s * 1.3, s * 0.4);
  ctx.fill();
  ctx.fillStyle = ic.fg;
  roundRectPath(ctx, -s * 0.85, 0, s * 1.9, s * 1.3, s * 0.4);
  ctx.fill();
  ctx.fillStyle = "#0b1220";
  ctx.beginPath();
  ctx.arc(-s * 0.55, -s * 0.85, s * 0.18, 0, Math.PI * 2);
  ctx.arc(s * 0.55, s * 0.85, s * 0.18, 0, Math.PI * 2);
  ctx.fill();
};

const drawNode = (ctx, p, ic) => {
  ctx.strokeStyle = ic.fg;
  ctx.lineWidth = Math.max(1.5, p.r * 0.06);
  ctx.beginPath();
  const r = p.r * 0.48;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = ic.fg;
  ctx.font = `700 ${p.r * 0.38}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("JS", 0, p.r * 0.04);
};

const drawDocker = (ctx, p, ic) => {
  ctx.fillStyle = ic.fg;
  const s = p.r * 0.16;
  const cells = [
    [-2, 0], [-1, 0], [0, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1], [0, -2],
  ];
  cells.forEach(([cx, cy]) => {
    roundRectPath(
      ctx,
      cx * s * 1.15 - s * 0.45,
      cy * s * 1.15 - s * 0.45,
      s * 0.9,
      s * 0.9,
      s * 0.15
    );
    ctx.fill();
  });
  ctx.beginPath();
  ctx.moveTo(-p.r * 0.5, s * 0.7);
  ctx.quadraticCurveTo(0, p.r * 0.42, p.r * 0.55, s * 0.55);
  ctx.quadraticCurveTo(p.r * 0.15, p.r * 0.15, -p.r * 0.5, s * 0.7);
  ctx.fill();
};

const drawGit = (ctx, p, ic) => {
  ctx.strokeStyle = ic.fg;
  ctx.fillStyle = ic.fg;
  ctx.lineWidth = Math.max(1.5, p.r * 0.07);
  ctx.beginPath();
  ctx.moveTo(0, -p.r * 0.4);
  ctx.lineTo(0, p.r * 0.4);
  ctx.moveTo(0, -p.r * 0.05);
  ctx.lineTo(p.r * 0.32, -p.r * 0.3);
  ctx.stroke();
  [
    [0, -p.r * 0.4],
    [0, p.r * 0.4],
    [p.r * 0.32, -p.r * 0.3],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, p.r * 0.09, 0, Math.PI * 2);
    ctx.fill();
  });
};

const drawVue = (ctx, p, ic) => {
  ctx.fillStyle = ic.fg;
  ctx.beginPath();
  ctx.moveTo(-p.r * 0.48, -p.r * 0.32);
  ctx.lineTo(0, p.r * 0.4);
  ctx.lineTo(p.r * 0.48, -p.r * 0.32);
  ctx.lineTo(p.r * 0.28, -p.r * 0.32);
  ctx.lineTo(0, p.r * 0.1);
  ctx.lineTo(-p.r * 0.28, -p.r * 0.32);
  ctx.closePath();
  ctx.fill();
};

const ICONS = [
  { label: "GH", name: "GitHub", bg: "#1e293b", fg: "#94a3b8", draw: drawGithub },
  { label: "⚛", name: "React", bg: "#0f172a", fg: "#61dafb", draw: drawReact },
  { label: "N", name: "Next.js", bg: "#1e1b4b", fg: "#a5b4fc", draw: drawNext },
  { label: "Py", name: "Python", bg: "#1e293b", fg: "#fbbf24", draw: drawPython },
  { label: "JS", name: "JavaScript", bg: "#1e293b", fg: "#facc15", draw: drawTextIcon },
  { label: "TS", name: "TypeScript", bg: "#1e3a5f", fg: "#60a5fa", draw: drawTextIcon },
  { label: "⬡", name: "Node.js", bg: "#0f2e1a", fg: "#4ade80", draw: drawNode },
  { label: "🐳", name: "Docker", bg: "#0c2a4d", fg: "#38bdf8", draw: drawDocker },
  { label: "git", name: "Git", bg: "#2d1b15", fg: "#f87171", draw: drawGit },
  { label: "V", name: "Vue", bg: "#0f231c", fg: "#34d399", draw: drawVue },
  { label: "CSS", name: "CSS3", bg: "#1e293b", fg: "#818cf8", draw: drawTextIcon },
  { label: "5", name: "HTML5", bg: "#2d1510", fg: "#fb923c", draw: drawTextIcon },
];

const REPEL_RADIUS = 160;
const REPEL_STRENGTH = 1400;

export default function FloatingTechIcons({ iconCount = 26, className = "", style = {} }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const frameRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;

    const makeParticle = (i) => {
      const icon = ICONS[i % ICONS.length];
      const r = 26 + Math.random() * 20;
      const { w, h } = sizeRef.current;
      return {
        icon,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r,
        baseAlpha: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        angle: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: iconCount }, (_, i) => makeParticle(i));
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMove = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top, active: true };
    };
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseLeave = () => (mouseRef.current.active = false);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => (mouseRef.current.active = false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let t = 0;
    const step = () => {
      t += 1;
      const { w, h } = sizeRef.current;
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        p.vx += Math.cos(t * 0.004 + p.phase) * 0.0025;
        p.vy += Math.sin(t * 0.004 + p.phase) * 0.0025;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < REPEL_RADIUS) {
            const force = ((1 - dist / REPEL_RADIUS) * REPEL_STRENGTH) / (dist * dist + 400);
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin * 0.01 + p.vx * 0.002;

        const pad = p.r + 10;
        if (p.x < -pad) p.x = w + pad;
        if (p.x > w + pad) p.x = -pad;
        if (p.y < -pad) p.y = h + pad;
        if (p.y > h + pad) p.y = -pad;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * 0.15);
        ctx.globalAlpha = p.baseAlpha;

        ctx.shadowColor = p.icon.fg;
        ctx.shadowBlur = p.r * 0.5;
        ctx.fillStyle = p.icon.bg;
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        p.icon.draw(ctx, p, p.icon);
        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [iconCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none", ...style }}
    />
  );
}
