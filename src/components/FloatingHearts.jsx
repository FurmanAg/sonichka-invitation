import { motion } from 'framer-motion';

const decorations = [
  { left: '6%', top: '14%', size: 22, delay: 0.4, symbol: '♡' },
  { left: '14%', top: '76%', size: 15, delay: 1.6, symbol: '✦' },
  { left: '24%', top: '8%', size: 18, delay: 2.4, symbol: '♥' },
  { left: '37%', top: '84%', size: 24, delay: 0.7, symbol: '♡' },
  { left: '56%', top: '12%', size: 13, delay: 1.2, symbol: '✦' },
  { left: '70%', top: '84%', size: 20, delay: 2.8, symbol: '♥' },
  { left: '87%', top: '19%', size: 24, delay: 0.2, symbol: '♡' },
  { left: '92%', top: '63%', size: 14, delay: 1.9, symbol: '✦' },
  { left: '77%', top: '42%', size: 13, delay: 0.9, symbol: '♥' },
  { left: '4%', top: '48%', size: 17, delay: 2.1, symbol: '✦' },
];

export default function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {decorations.map((item, index) => (
        <motion.span
          key={index}
          className="background-heart"
          style={{ left: item.left, top: item.top, fontSize: item.size }}
          animate={{ y: [0, -13, 0], x: [0, index % 2 ? 5 : -5, 0], rotate: [0, 7, 0], opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 4.5 + (index % 3), delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
}
