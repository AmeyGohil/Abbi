import { useEffect, useRef } from "react";

const COLORS = [
  [255, 182, 214],
  [232, 74, 138],
  [196, 90, 148],
  [255, 143, 190],
  [248, 209, 230],
  [255, 255, 255],
];

const NUM = 280;
const PI2 = 2 * Math.PI;

function range(a: number, b: number) {
  return (b - a) * Math.random() + a;
}

interface Dot {
  style: number[];
  rgb: string;
  r: number;
  r2: number;
  opacity: number;
  dop: number;
  x: number;
  y: number;
  xmax: number;
  ymax: number;
  vx: number;
  vy: number;
}

function makeDot(w: number, h: number, xpos: number): Dot {
  const style = COLORS[~~range(0, COLORS.length)];
  const r = ~~range(2, 5);
  const r2 = 2 * r;
  return {
    style,
    rgb: `rgba(${style[0]},${style[1]},${style[2]}`,
    r,
    r2,
    opacity: 0,
    dop: 0.03 * range(1, 4),
    x: range(-r2, w - r2),
    y: range(-20, h - r2),
    xmax: w - r,
    ymax: h - r,
    vx: range(0, 2) + 8 * xpos - 5,
    vy: 0.7 * r + range(-1, 1),
  };
}

function resetDot(dot: Dot, w: number, h: number, xpos: number) {
  dot.opacity = 0;
  dot.dop = 0.03 * range(1, 4);
  dot.x = range(-dot.r2, w - dot.r2);
  dot.y = range(-20, h - dot.r2);
  dot.xmax = w - dot.r;
  dot.ymax = h - dot.r;
  dot.vx = range(0, 2) + 8 * xpos - 5;
  dot.vy = 0.7 * dot.r + range(-1, 1);
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xposRef = useRef(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, rafId = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: Dot[] = Array.from({ length: NUM }, () =>
      makeDot(w, h, xposRef.current)
    );

    const onMouseMove = (e: MouseEvent) => {
      xposRef.current = e.pageX / w;
    };
    window.addEventListener("mousemove", onMouseMove);

    const step = () => {
      rafId = requestAnimationFrame(step);
      ctx.clearRect(0, 0, w, h);
      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.opacity += dot.dop;
        if (dot.opacity > 1) { dot.opacity = 1; dot.dop *= -1; }
        if (dot.opacity < 0 || dot.y > dot.ymax) resetDot(dot, w, h, xposRef.current);
        if (!(dot.x > 0 && dot.x < dot.xmax)) dot.x = (dot.x + dot.xmax) % dot.xmax;
        ctx.beginPath();
        ctx.arc(~~dot.x, ~~dot.y, dot.r, 0, PI2, false);
        ctx.fillStyle = `${dot.rgb},${dot.opacity})`;
        ctx.fill();
      }
    };
    step();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

export default Confetti;
