import { motion } from 'framer-motion';

interface Props {
  username: string;
  onCancel: () => void;
}

export default function WaitingScreen({ username, onCancel }: Props) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spinning ring */}
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '40px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: '#7c3aed',
            borderRightColor: '#ec4899',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '14px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#06b6d4',
            borderLeftColor: '#f59e0b',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
          🎮
        </div>
      </div>

      <motion.h2
        className="font-boogaloo"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ fontSize: 'clamp(24px, 5vw, 40px)', color: '#fff', marginBottom: '12px' }}
      >
        Finding opponent...
      </motion.h2>

      <p style={{ color: '#ffffff66', marginBottom: '48px', fontSize: '16px' }}>
        Playing as <span style={{ color: '#ec4899', fontWeight: 700 }}>{username}</span>
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        style={{
          fontSize: '16px',
          padding: '12px 32px',
          borderRadius: '100px',
          border: '1px solid #ffffff33',
          background: 'transparent',
          color: '#ffffff66',
          cursor: 'pointer',
        }}
      >
        Cancel
      </motion.button>
    </motion.div>
  );
}
