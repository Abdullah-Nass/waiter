// lib/socket/server.ts
import { Server as SocketIOServer } from "socket.io";

export function getIO(): SocketIOServer {
  const io = globalThis.io as SocketIOServer | undefined;
  if (!io) {
    throw new Error(
      "Socket.IO server instance has not been initialized on globalThis.",
    );
  }
  return io;
}
