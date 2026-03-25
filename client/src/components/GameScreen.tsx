import { motion } from 'framer-motion';

export type Choice = 'rock' | 'paper' | 'scissors';

const CHOICES: { id: Choice; emoji: string; label: string }[] = [
  { id: 'rock',     emoji: '🪨', label: 'Rock' },
  { id: 'paper',    emoji: '📄', label: 'Paper' },
  { id: 'scissors', emoji: '✂️', label: 'Scissors' },
];

interface Props {
  username: string;
  opponent: string;
  myScore: number;
  opponentScore: number;
  myChoice: Choice | null;
  opponentChose: boolean;
  onChoose: (c: Choice) => void;
}

export default function GameScreen({ username, opponent, myScore, opponentScore, myChoice, opponentChose, onChoose }: Props) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen px-4"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '48px',
          padding: '16px 32px',
          background: '#ffffff0d',
          borderRadius: '100px',
          border: '1px solid #ffffff22',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#ffffff66', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>You</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#ec4899' }}>{username}</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{myScore}</div>
        </div>
        <div style={{ fontSize: '24px', color: '#ffffff44', fontWeight: 900 }}>VS</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#ffffff66', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Opponent</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#6bb5ff' }}>{opponent}</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{opponentScore}</div>
        </div>
      </motion.div>

      {/* Opponent status */}
      <motion.div
        style={{ marginBottom: '32px', fontSize: '16px', color: opponentChose ? '#6bffb8' : '#ffffff66' }}
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.5, repeat: opponentChose ? 0 : Infinity }}
      >
        {opponentChose ? '✅ Opponent is ready!' : '⏳ Waiting for opponent...'}
      </motion.div>

      {/* Choice cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '460px' }}>
        {CHOICES.map((c, i) => {
          const isSelected = myChoice === c.id;
          const isDisabled = myChoice !== null;
          return (
            <motion.button
              key={c.id}
              initial={{ x: -40, opacity: 0 }}
              animate={{
                x: 0,
                opacity: isDisabled && !isSelected ? 0.3 : 1,
                scale: isSelected ? 1.04 : 1,
              }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              whileHover={!isDisabled ? { scale: 1.04, x: 6 } : {}}
              whileTap={!isDisabled ? { scale: 0.97 } : {}}
              onClick={() => !isDisabled && onChoose(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '22px 28px',
                borderRadius: '20px',
                border: isSelected ? '2px solid #ec4899' : '2px solid #ffffff22',
                background: isSelected ? 'linear-gradient(135deg,#7c3aed33,#ec489933)' : '#ffffff0d',
                cursor: isDisabled ? 'default' : 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: isSelected ? '0 0 28px #ec489955' : 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <span style={{ fontSize: '44px', flexShrink: 0 }}>{c.emoji}</span>
              <span style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: isSelected ? '#fff' : '#ffffffcc' }}>
                {c.label}
              </span>
              {isSelected && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ marginLeft: 'auto', fontSize: '24px' }}>
                  ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
