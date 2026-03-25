import { io, Socket } from 'socket.io-client';

// In dev, proxy to localhost:3001. In production, connect to same origin.
const SERVER_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001')
  : window.location.origin;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SERVER_URL, { autoConnect: false });
  }
  return socket;
}

export function resetSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
