import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingShapes from './components/FloatingShapes';
import LandingScreen from './components/LandingScreen';
import UsernameModal from './components/UsernameModal';
import WaitingScreen from './components/WaitingScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { getSocket, resetSocket } from './lib/socket';
import type { Choice } from './components/GameScreen';

type Phase = 'landing' | 'modal' | 'waiting' | 'game' | 'result' | 'left';

interface RoundResult {
  choices: Record<string, Choice>;
  winner: string | null; // socketId or null for draw
  scores: Record<string, number>;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [username, setUsername] = useState('');
  const [opponent, setOpponent] = useState('');
  const [roomId, setRoomId] = useState('');
  const [myChoice, setMyChoice] = useState<Choice | null>(null);
  const [opponentChose, setOpponentChose] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [opponentWantsRematch, setOpponentWantsRematch] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const goHome = useCallback(() => {
    resetSocket();
    setPhase('landing');
    setUsername('');
    setOpponent('');
    setRoomId('');
    setMyChoice(null);
    setOpponentChose(false);
    setRoundResult(null);
    setOpponentWantsRematch(false);
    setMyScore(0);
    setOpponentScore(0);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on('matched', ({ roomId: rid, opponent: opp }: { roomId: string; opponent: string }) => {
      setRoomId(rid);
      setOpponent(opp);
      setMyChoice(null);
      setOpponentChose(false);
      setPhase('game');
    });

    socket.on('opponent_chose', () => setOpponentChose(true));

    socket.on('round_result', (result: RoundResult) => {
      setRoundResult(result);
      setMyScore(result.scores[socket.id!] ?? 0);
      // opponent score = the other key
      const oppId = Object.keys(result.scores).find(id => id !== socket.id);
      setOpponentScore(oppId ? result.scores[oppId] : 0);
      setPhase('result');
    });

    socket.on('rematch_ready', () => {
      setRoundResult(null);
      setMyChoice(null);
      setOpponentChose(false);
      setOpponentWantsRematch(false);
      setPhase('game');
    });

    socket.on('opponent_wants_rematch', () => setOpponentWantsRematch(true));

    socket.on('opponent_left', () => {
      setPhase('left');
    });

    return () => {
      socket.off('matched');
      socket.off('opponent_chose');
      socket.off('round_result');
      socket.off('rematch_ready');
      socket.off('opponent_wants_rematch');
      socket.off('opponent_left');
    };
  }, []);

  function handleUsernameConfirm(name: string) {
    setUsername(name);
    const socket = getSocket();
    socket.connect();
    socket.emit('quickplay', { username: name });
    setPhase('waiting');
  }

  function handleChoose(choice: Choice) {
    setMyChoice(choice);
    const socket = getSocket();
    socket.emit('choose', { roomId, choice });
  }

  function handleRematch() {
    setOpponentWantsRematch(false);
    const socket = getSocket();
    socket.emit('rematch', { roomId });
  }

  const socket = getSocket();
  const mySocketId = socket.id ?? '';

  const myChoiceInResult = roundResult ? roundResult.choices[mySocketId] : null;
  const oppSocketId = roundResult ? Object.keys(roundResult.choices).find(id => id !== mySocketId) : null;
  const oppChoiceInResult = (roundResult && oppSocketId) ? roundResult.choices[oppSocketId] : null;
  const didIWin = roundResult
    ? roundResult.winner === null
      ? null
      : roundResult.winner === mySocketId
    : null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0d0014' }}>
      <FloatingShapes />

      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <LandingScreen key="landing" onQuickplay={() => setPhase('modal')} />
        )}
        {phase === 'waiting' && (
          <WaitingScreen key="waiting" username={username} onCancel={goHome} />
        )}
        {phase === 'game' && (
          <GameScreen
            key="game"
            username={username}
            opponent={opponent}
            myScore={myScore}
            opponentScore={opponentScore}
            myChoice={myChoice}
            opponentChose={opponentChose}
            onChoose={handleChoose}
          />
        )}
        {phase === 'left' && (
          <div key="left" style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', gap: '20px' }}>
            <div style={{ fontSize: '64px' }}>😔</div>
            <h2 className="font-boogaloo" style={{ fontSize: '36px', color: '#fff', margin: 0 }}>Opponent left</h2>
            <p style={{ color: '#ffffff66' }}>Your opponent disconnected.</p>
            <button onClick={goHome} className="font-boogaloo" style={{ fontSize: '20px', padding: '14px 40px', borderRadius: '100px', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', cursor: 'pointer' }}>
              Back to Home
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Game result overlay (shown on top of game screen) */}
      <AnimatePresence>
        {phase === 'result' && myChoiceInResult && oppChoiceInResult && (
          <ResultScreen
            key="result"
            myChoice={myChoiceInResult}
            opponentChoice={oppChoiceInResult}
            didIWin={didIWin}
            username={username}
            opponent={opponent}
            myScore={myScore}
            opponentScore={opponentScore}
            opponentWantsRematch={opponentWantsRematch}
            onRematch={handleRematch}
            onLeave={goHome}
          />
        )}
      </AnimatePresence>

      {/* Username modal (overlays landing) */}
      <AnimatePresence>
        {phase === 'modal' && (
          <UsernameModal
            key="modal"
            onConfirm={handleUsernameConfirm}
            onCancel={() => setPhase('landing')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
