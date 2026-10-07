import { io, Socket } from "socket.io-client";

const sockets = new Map<string, Socket>();

export function getSocket(role: string, userId?: string): Socket {
  const socketKey = `${role}:${userId ?? "anonymous"}`;
  const existingSocket = sockets.get(socketKey);

  if (existingSocket) {
    return existingSocket;
  }

  const socket = io({
    query: { role, userId },
    autoConnect: true,
  });

  sockets.set(socketKey, socket);

  return socket;
}
