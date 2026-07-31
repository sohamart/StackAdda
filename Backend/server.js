require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./Config/db");
const cron = require("node-cron");
const shortRoutes = require("./Routes/shortRoutes");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-sync YouTube Shorts every 12 hours
    if (shortRoutes.syncYoutubeShorts) {
      cron.schedule('0 */12 * * *', async () => {
        console.log('Running auto-sync for YouTube Shorts...');
        try {
          const added = await shortRoutes.syncYoutubeShorts();
          console.log(`Auto-sync complete. Added ${added} shorts.`);
          
          if (shortRoutes.syncGlobalShorts) {
            console.log('Running auto-sync for Global Coding Shorts...');
            const addedGlobal = await shortRoutes.syncGlobalShorts();
            console.log(`Global auto-sync complete. Added ${addedGlobal} shorts.`);
          }
        } catch (error) {
          console.error('Auto-sync failed:', error.message);
        }
      });
    }

    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://stack-adda.vercel.app",
          "https://stackadda.vercel.app",
          "https://stackbackend-omega.vercel.app",
          "https://stackadda.me",
          "https://www.stackadda.me",
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