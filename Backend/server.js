require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./Config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://stack-adda.vercel.app",
          "https://stackbackend-omega.vercel.app",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Make io accessible globally
    app.set("io", io);

    io.on("connection", (socket) => {
      // console.log(`User connected: ${socket.id}`);

      // Join a course room to get live class updates
      socket.on("join_course_room", (courseId) => {
        socket.join(`course_${courseId}`);
        // console.log(`Socket ${socket.id} joined room course_${courseId}`);
      });

      socket.on("leave_course_room", (courseId) => {
        socket.leave(`course_${courseId}`);
      });

      socket.on("disconnect", () => {
        // console.log(`User disconnected: ${socket.id}`);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server Failed:", error);
  }
};

startServer();