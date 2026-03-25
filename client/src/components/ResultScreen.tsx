import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Choice } from './GameScreen';

const EMOJI: Record<Choice, string> = { rock: '🪨', paper: '📄', scissors: '✂️' };
const LABEL: Record<Choice, string> = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };

interface Props {
  myChoice: Choice;
  opponentChoice: Choice;
  didIWin: boolean | null; // true=win, false=lose, null=draw
  username: string;
  opponent: string;
  myScore: number;
  opponentScore: number;
  opponentWantsRematch: boolean;
  onRematch: () => void;
  onLeave: () => void;
}

export default function ResultScreen({ myChoice, opponentChoice, didIWin, username, opponent, myScore, opponentScore, opponentWantsRematch, onRematch, onLeave }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || didIWin === false) return;
    firedRef.current = true;

    if (didIWin === true) {
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#ff6bcb','#ffdf70','#6bffb8','#6bb5ff'] });
        confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#ff6bcb','#ffdf70','#6bffb8','#6bb5ff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
      setTimeout(() => confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } }), 100);
    }
  }, [didIWin]);

  const resultLabel = didIWin === null ? "It's a Draw!" : didIWin ? 'You Win! 🎉' : 'You Lose 😭';
  const resultColor = didIWin === null ? '#ffdf70' : didIWin ? '#6bffb8' : '#ff6b6b';

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 5, background: '#0d001499', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#1a0030',
          border: `2px solid ${resultColor}44`,
          borderRadius: '28px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: `0 0 60px ${resultColor}33`,
        }}
      >
        {/* Result headline */}
        <motion.h2
          className="font-boogaloo"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
          style={{ fontSize: 'clamp(32px, 8vw, 52px)', color: resultColor, marginBottom: '28px' }}
        >
          {resultLabel}
        </motion.h2>

        {/* Choices display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#ffffff55', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{username}</div>
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }} style={{ fontSize: '56px', lineHeight: 1 }}>
              {EMOJI[myChoice]}
            </motion.div>
            <div style={{ fontSize: '14px', color: '#ffffffbb', marginTop: '4px', fontWeight: 700 }}>{LABEL[myChoice]}</div>
          </div>
          <div style={{ fontSize: '28px', color: '#ffffff33', fontWeight: 900 }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#ffffff55', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{opponent}</div>
            <motion.div initial={{ scale: 0, rotate: 20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: 'spring' }} style={{ fontSize: '56px', lineHeight: 1 }}>
              {EMOJI[opponentChoice]}
            </motion.div>
            <div style={{ fontSize: '14px', color: '#ffffffbb', marginTop: '4px', fontWeight: 700 }}>{LABEL[opponentChoice]}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{ fontSize: '16px', color: '#ffffff55', marginBottom: '28px' }}>
          Score: <span style={{ color: '#ec4899', fontWeight: 700 }}>{myScore}</span> – <span style={{ color: '#6bb5ff', fontWeight: 700 }}>{opponentScore}</span>
        </div>

        {opponentWantsRematch && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '14px', color: '#6bffb8', marginBottom: '12px' }}>
            {opponent} wants a rematch!
          </motion.p>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRematch}
            className="font-boogaloo"
            style={{ fontSize: '20px', padding: '14px 36px', borderRadius: '100px', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', cursor: 'pointer', letterSpacing: '1px' }}
          >
            {opponentWantsRematch ? 'Accept!' : 'Rematch'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLeave}
            style={{ fontSize: '16px', padding: '14px 28px', borderRadius: '100px', border: '1px solid #ffffff33', background: 'transparent', color: '#ffffff66', cursor: 'pointer' }}
          >
            Leave
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
