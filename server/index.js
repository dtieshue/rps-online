const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());

// Serve Vite-built frontend
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// --- State ---
let waitingPlayer = null; // { socketId, username }
const rooms = new Map();  // roomId -> { players: [p1, p2], choices: {}, rematch: Set, scores: {} }
// players[i] = { socketId, username }

// --- Helpers ---
function getWinner(c1, c2) {
  if (c1 === c2) return 'draw';
  if (
    (c1 === 'rock' && c2 === 'scissors') ||
    (c1 === 'paper' && c2 === 'rock') ||
    (c1 === 'scissors' && c2 === 'paper')
  ) return 'p1';
  return 'p2';
}

function getRoomForSocket(socketId) {
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.some(p => p.socketId === socketId)) return { roomId, room };
  }
  return null;
}

// --- Socket handlers ---
io.on('connection', (socket) => {
  console.log('connect', socket.id);

  socket.on('quickplay', ({ username }) => {
    if (waitingPlayer && waitingPlayer.socketId !== socket.id) {
      // Match!
      const roomId = randomUUID();
      const p1 = waitingPlayer;
      const p2 = { socketId: socket.id, username };
      waitingPlayer = null;

      rooms.set(roomId, {
        players: [p1, p2],
        choices: {},
        rematch: new Set(),
        scores: { [p1.socketId]: 0, [p2.socketId]: 0 },
      });

      socket.join(roomId);
      io.sockets.sockets.get(p1.socketId)?.join(roomId);

      io.to(p1.socketId).emit('matched', { roomId, opponent: p2.username });
      io.to(p2.socketId).emit('matched', { roomId, opponent: p1.username });

      console.log(`Matched ${p1.username} vs ${p2.username} in room ${roomId}`);
    } else {
      // Wait
      waitingPlayer = { socketId: socket.id, username };
      console.log(`${username} is waiting`);
    }
  });

  socket.on('choose', ({ roomId, choice }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.choices[socket.id] = choice;

    const [p1, p2] = room.players;
    const otherId = socket.id === p1.socketId ? p2.socketId : p1.socketId;

    // Tell the opponent that this player has chosen (don't reveal what)
    io.to(otherId).emit('opponent_chose');

    // If both have chosen, resolve the round
    if (room.choices[p1.socketId] && room.choices[p2.socketId]) {
      const c1 = room.choices[p1.socketId];
      const c2 = room.choices[p2.socketId];
      const result = getWinner(c1, c2);

      let winnerSocketId = null;
      if (result === 'p1') {
        winnerSocketId = p1.socketId;
        room.scores[p1.socketId]++;
      } else if (result === 'p2') {
        winnerSocketId = p2.socketId;
        room.scores[p2.socketId]++;
      }

      io.to(roomId).emit('round_result', {
        choices: { [p1.socketId]: c1, [p2.socketId]: c2 },
        winner: winnerSocketId, // null = draw
        scores: room.scores,
      });

      // Reset choices for next round
      room.choices = {};
      room.rematch = new Set();
    }
  });

  socket.on('rematch', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.rematch.add(socket.id);

    if (room.rematch.size === 2) {
      room.rematch = new Set();
      io.to(roomId).emit('rematch_ready');
    } else {
      const [p1, p2] = room.players;
      const otherId = socket.id === p1.socketId ? p2.socketId : p1.socketId;
      io.to(otherId).emit('opponent_wants_rematch');
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);

    // Clear from waiting queue
    if (waitingPlayer?.socketId === socket.id) {
      waitingPlayer = null;
    }

    // Notify room partner
    const found = getRoomForSocket(socket.id);
    if (found) {
      const { roomId, room } = found;
      const other = room.players.find(p => p.socketId !== socket.id);
      if (other) {
        io.to(other.socketId).emit('opponent_left');
      }
      rooms.delete(roomId);
    }
  });
});

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
