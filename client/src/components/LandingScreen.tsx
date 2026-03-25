import { motion } from 'framer-motion';

interface Props {
  onQuickplay: () => void;
}

export default function LandingScreen({ onQuickplay }: Props) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, type: 'spring', bounce: 0.5 }}
      >
        <h1 className="font-boogaloo" style={{ fontSize: 'clamp(80px, 20vw, 170px)', color: '#fff', lineHeight: 1, margin: 0 }}>
          RPS
        </h1>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: 'clamp(14px, 3.5vw, 22px)', color: '#ffffff88', marginTop: '8px', marginBottom: '40px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        Rock · Paper · Scissors — Online
      </motion.p>

      {/* Floating emoji row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: '24px', marginBottom: '48px', fontSize: '52px' }}
      >
        {['🪨', '📄', '✂️'].map((e, i) => (
          <motion.span key={i} animate={{ y: [0, -12, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}>
            {e}
          </motion.span>
        ))}
      </motion.div>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.6 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onQuickplay}
        className="pulse-btn font-boogaloo"
        style={{ fontSize: '28px', padding: '18px 60px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', letterSpacing: '2px' }}
      >
        QUICKPLAY
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ color: '#ffffff33', marginTop: '20px', fontSize: '14px' }}
      >
        anonymous · no login · instant matchmaking
      </motion.p>
    </motion.div>
  );
}
