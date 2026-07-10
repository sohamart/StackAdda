const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const authRoutes = require("./Routes/authRoutes");
const app = express();
const profileRoutes = require("./Routes/profileRoutes");
const errorHandler = require("./Middleware/errorMiddleware");
const studentRoutes = require("./Routes/studentRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const couponRoutes = require("./Routes/couponRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const progressRoutes = require("./Routes/progressRoutes");
const contactRoutes = require("./Routes/contactRoutes");


/* ==========================
   Middlewares
========================== */

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.use(cors({
  origin: ['http://localhost:3000', "http://localhost:5173", "https://stack-adda.vercel.app", "https://stackbackend-omega.vercel.app"],
  
    credentials: true
},
));


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/contact", contactRoutes);
/* ==========================
   Test Route
========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Stack Adda Backend Running Successfully",
  });
});

/* ==========================
   404 Route
========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});
app.use(errorHandler);

module.exports = app;
