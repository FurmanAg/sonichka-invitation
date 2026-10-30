import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatSelection } from './DateTimePage.jsx';

const toLocalDateValue = (date) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function SendingPage({ selection, onSent }) {
  const [status, setStatus] = useState('sending');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const started = useRef(false);
  const finalTimer = useRef(null);

  useEffect(() => {
    if (started.current) return undefined;
    started.current = true;
    const controller = new AbortController();
    let stillHere = true;

    const send = async () => {
      setStatus('sending');
      setError('');
      try {
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        const response = await fetch(`${apiBase}/api/invitations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Date is a calendar value, so preserve the visitor's local day rather than converting it to UTC.
            date: toLocalDateValue(selection.date),
            time: selection.time,
          }),
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Не вдалося надіслати листівочку.');
        if (!stillHere) return;
        setStatus('success');
        finalTimer.current = window.setTimeout(onSent, 1600);
      } catch (requestError) {
        if (!stillHere || requestError.name === 'AbortError') return;
        setError(requestError.message || 'Сервер тимчасово недоступний.');
        setStatus('error');
      }
    };
    send();
    return () => {
      stillHere = false;
      controller.abort();
      window.clearTimeout(finalTimer.current);
    };
  }, [attempt, selection, onSent]);

  const retry = () => {
    started.current = false;
    setAttempt((count) => count + 1);
  };
  const summary = formatSelection(selection.date, selection.time);

  return (
    <div className={`sending-card card-glass ${status}`}>
      <div className="sending-sparkles" aria-hidden="true"><span>✦</span><span>♥</span><span>✧</span><span>♡</span></div>
      <motion.div className="envelope-scene" animate={status === 'success' ? { y: [-2, -28, -50], x: [0, 10, 72], rotate: [0, -3, 8], opacity: [1, 1, 0] } : { y: [0, -7, 0] }} transition={status === 'success' ? { duration: 1.25, ease: 'easeIn' } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="envelope">
          <span className="envelope-heart">♥</span>
          <div className="envelope-flap" />
        </div>
      </motion.div>

      {status === 'sending' && <><p className="eyebrow">секундочку, це важливо</p><h1>Я передам це твоєму Масєку! <span>❤️</span></h1><p className="sending-copy">Відправляю листівочку з вашим особливим часом…</p><div className="sending-dots"><i /><i /><i /></div></>}
      {status === 'success' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><p className="eyebrow">відповідь уже летить</p><h1>ЛИСТІВОЧКА НАДІСЛАНА <span>💌</span></h1><p className="sending-copy">{summary}</p></motion.div>}
      {status === 'error' && <div className="send-error"><p className="eyebrow">ой, маленька перешкода</p><h1>Листівочка ще не долетіла</h1><p>{error}</p><button type="button" className="primary-button" onClick={retry}>Спробувати ще раз <span>💌</span></button></div>}
    </div>
  );
}
