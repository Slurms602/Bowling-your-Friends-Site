// Scroll-in reveals and a confetti pop when someone hits download.

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const colors = ["#ff3fb4", "#ffe14d", "#2de2ff", "#3ddc97", "#b980ff"];
let bits = [];
let running = false;

function burst(x, y) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  for (let i = 0; i < 140; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 10;
    bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: Math.random() * 6.28, vr: Math.random() * .4 - .2,
      w: 8 + Math.random() * 8, h: 5 + Math.random() * 6, c: colors[i % colors.length], life: 1 });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const b of bits) {
    b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life -= 0.008;
    ctx.save();
    ctx.globalAlpha = Math.max(b.life, 0);
    ctx.translate(b.x, b.y);
    ctx.rotate(b.r);
    ctx.fillStyle = b.c;
    ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    ctx.restore();
  }
  bits = bits.filter((b) => b.life > 0 && b.y < innerHeight + 40);
  if (bits.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

document.querySelectorAll("[data-confetti]").forEach((a) =>
  a.addEventListener("click", (e) => burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2)));
