import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);
const corsOptions = {
  origin: ["https://chatterbox-beta-v2.vercel.app/", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS", "PUT", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
const io = new Server(httpServer, {
  cors: corsOptions,
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("set-user-id", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log("user id set: ", userId);
  });

  socket.on("disconnect", () => {
    console.log("User diconnected: ", socket.id);
    for (const [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        break;
      }
    }
  });

  socket.on("message", async (messageData) => {
    try {
      const { notifyId, msgId, senderId, receiverId, msg, image, name } =
        messageData;
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", {
          notifyId,
          msgId,
          senderId,
          receiverId,
          msg,
          image,
          name,
        });
        console.log("Message sent to receiver");
      }
    } catch (error) {
      console.error("Error occured: ", error);
    }
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("typing", { senderId, receiverId });
  });

  socket.on("stoppedTyping", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("stoppedTyping", { senderId, receiverId });
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log("Listening to the port : ", PORT);
});
