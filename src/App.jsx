import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import InvitationPage from './components/InvitationPage.jsx';
import DateTimePage from './components/DateTimePage.jsx';
import SendingPage from './components/SendingPage.jsx';
import FinalPage from './components/FinalPage.jsx';
import FloatingHearts from './components/FloatingHearts.jsx';
import CursorSparkles from './components/CursorSparkles.jsx';

const pageMotion = {
  initial: { opacity: 0, y: 20, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, scale: 0.985, transition: { duration: 0.3, ease: 'easeInOut' } },
};

export default function App() {
  const [page, setPage] = useState('invitation');
  const [selection, setSelection] = useState({ date: null, time: null });

  return (
    <main className={`app-shell page-${page}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <FloatingHearts />
      <CursorSparkles />

      <AnimatePresence mode="wait">
        {page === 'invitation' && (
          <motion.section key="invitation" className="screen" {...pageMotion}>
            <InvitationPage onAccepted={() => setPage('datetime')} />
          </motion.section>
        )}
        {page === 'datetime' && (
          <motion.section key="datetime" className="screen" {...pageMotion}>
            <DateTimePage
              selection={selection}
              onSelectionChange={setSelection}
              onConfirm={() => setPage('sending')}
            />
          </motion.section>
        )}
        {page === 'sending' && (
          <motion.section key="sending" className="screen" {...pageMotion}>
            <SendingPage selection={selection} onSent={() => setPage('final')} />
          </motion.section>
        )}
        {page === 'final' && (
          <motion.section key="final" className="screen" {...pageMotion}>
            <FinalPage selection={selection} />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
