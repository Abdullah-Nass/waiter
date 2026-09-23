import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentRole: string | null = null;

export function getSocket(role: string): Socket {
  if (!socket || currentRole !== role) {
    if (socket) {
      socket.disconnect();
    }
    currentRole = role;
    socket = io({
      query: { role },
      autoConnect: true,
    });
  }
  return socket;
}
