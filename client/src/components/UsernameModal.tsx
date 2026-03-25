import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onConfirm: (username: string) => void;
  onCancel: () => void;
}

export default function UsernameModal({ onConfirm, onCancel }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onConfirm(trimmed);
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-end sm:items-center justify-center"
      style={{ zIndex: 10, background: '#0d001488' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#1a0030',
          border: '1px solid #7c3aed55',
          borderRadius: '24px 24px 0 0',
          padding: '40px 32px 48px',
          boxShadow: '0 -20px 60px #7c3aed33',
        }}
        className="sm:rounded-3xl"
      >
        <h2 className="font-boogaloo" style={{ fontSize: '32px', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>
          Enter your name
        </h2>
        <p style={{ color: '#ffffff55', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
          This is what your opponent will see
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            autoFocus
            maxLength={20}
            placeholder="e.g. CoolPlayer99"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              fontSize: '22px',
              fontWeight: 700,
              fontFamily: "'Nunito', sans-serif",
              padding: '16px 20px',
              borderRadius: '14px',
              border: '2px solid #7c3aed88',
              background: '#ffffff11',
              color: '#fff',
              outline: 'none',
              textAlign: 'center',
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={name.trim().length === 0}
            className="font-boogaloo"
            style={{
              fontSize: '22px',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background: name.trim().length > 0 ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : '#ffffff22',
              color: '#fff',
              cursor: name.trim().length > 0 ? 'pointer' : 'not-allowed',
              letterSpacing: '1px',
              transition: 'background 0.2s',
            }}
          >
            FIND MATCH
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
