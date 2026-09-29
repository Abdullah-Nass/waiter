import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const role = socket.handshake.query.role as string;
    const userId = socket.handshake.query.userId as string;

    if (role === "KITCHEN" || role === "ADMIN") {
      socket.join("kitchen");
    }

    // Each waiter joins their own room
    if (userId) {
      socket.join(`waiter:${userId}`);
    }
    socket.on("disconnect", () => {
      // Clean disconnect
    });
  });

  // Attach io instance to globalThis for access in Server Actions
  globalThis.io = io;

  httpServer.listen(port, () => {
    console.log(`> Server ready on http://${hostname}:${port}`);
  });
});
