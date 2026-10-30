import { motion } from 'framer-motion';
import { formatSelection } from './DateTimePage.jsx';
import Pusheen from './Pusheen.jsx';

export default function FinalPage({ selection }) {
  const dateText = selection.date ? new Intl.DateTimeFormat('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' }).format(selection.date) : '';
  return (
    <div className="final-screen">
      <motion.div className="final-pusheen-wrap" initial={{ opacity: 0, scale: 0.72, y: 16 }} animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }} transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.55, ease: 'backOut' }, y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } }}>
        <Pusheen variant="heart" className="final-pusheen" />
      </motion.div>
      <motion.div className="final-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.58 }}>
        <p className="eyebrow">тепер це наша маленька таємниця</p>
        <h1>ВСЕ! ДОМОВИЛИСЬ <span>❤️</span></h1>
        <p className="final-subtitle">Зустрінемось <span>♡</span></p>
        <div className="final-date">
          <strong>{dateText ? dateText.charAt(0).toLocaleUpperCase('uk-UA') + dateText.slice(1) : ''}</strong>
          <span>О {selection.time}</span>
        </div>
        <p className="final-note">Буду ждати і буду цуцуть переживати ♡♡♡</p>
      </motion.div>
      <div className="final-mini-hearts" aria-hidden="true"><span>♥</span><span>✦</span><span>♡</span><span>♥</span><span>✧</span></div>
    </div>
  );
}
