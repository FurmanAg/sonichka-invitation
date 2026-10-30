import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

let nextId = 0;
const colors = ['#ff7dac', '#fff9f2', '#ffc0d1', '#ff9b79'];
const symbols = ['✦', '•', '♡', '✧'];

export default function CursorSparkles() {
  const [particles, setParticles] = useState([]);
  const last = useRef({ x: 0, y: 0, at: 0 });
  const timers = useRef(new Set());

  useEffect(() => {
    const removeParticle = (id) => setParticles((current) => current.filter((particle) => particle.id !== id));
    const addParticle = (x, y, force = false) => {
      const now = performance.now();
      const distance = Math.hypot(x - last.current.x, y - last.current.y);
      if (!force && now - last.current.at < 34) return;
      last.current = { x, y, at: now };
      const amount = force ? 3 : distance > 45 ? 3 : distance > 18 ? 2 : 1;
      const additions = Array.from({ length: amount }, () => ({
        id: nextId++,
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        dx: (Math.random() - 0.5) * 34,
        dy: -10 - Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: 9 + Math.random() * 10,
      }));
      setParticles((current) => [...current, ...additions].slice(-48));
      additions.forEach((particle) => {
        const timer = window.setTimeout(() => {
          timers.current.delete(timer);
          removeParticle(particle.id);
        }, 800);
        timers.current.add(timer);
      });
    };
    const onMove = (event) => addParticle(event.clientX, event.clientY);
    const onDown = (event) => addParticle(event.clientX, event.clientY, true);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      timers.current.forEach(window.clearTimeout);
      timers.current.clear();
    };
  }, []);

  return (
    <div className="cursor-sparkles" aria-hidden="true">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="cursor-particle"
            initial={{ opacity: 0.95, scale: 0.35, x: particle.x, y: particle.y }}
            animate={{ opacity: 0, scale: 1.25, x: particle.x + particle.dx, y: particle.y + particle.dy, rotate: 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.78, ease: 'easeOut' }}
            style={{ color: particle.color, fontSize: particle.size, textShadow: `0 0 9px ${particle.color}` }}
          >
            {particle.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
