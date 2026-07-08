const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/AuthRoutes");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:3000', "http://localhost:5173", "https://stack-adda.vercel.app", ],
  
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Stack Adda Backend Running 🚀");
});


module.exports = app;