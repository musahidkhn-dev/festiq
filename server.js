import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import colors from "colors";
import cors from "cors";
import rateLimit from "express-rate-limit";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/dbConfig.js";
import errorHandler from "./Middleware/errorHandler.js";
import eventRoutes from "./routes/eventRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import giveAnswer from "./controller/chatController.js";
import protect from "./Middleware/authMiddleware.js";

//DB CONNECTION
connectDB();

const PORT = process.env.PORT || 8080;

const app = express();

// Flexible CORS for multiple dev ports
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Enable pre-flight for all routes (Regex literal for Express 5)

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again after 15 minutes." }
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

console.log("SERVER: Registered GEMINI_API_KEY Check -", !!process.env.GEMINI_API_KEY);


app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend working",
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

//Admin Routes
app.use("/api/admin", adminRoutes);

// Event Routes
app.use("/api/events", eventRoutes);

// Order Routes
app.use("/api/orders", orderRoutes)

// Coupon Routes
app.use("/api/coupons", couponRoutes)

// Comment Routes
app.use("/api/comment", commentRoutes)

// Chat Routes
console.log("SERVER: Registering /api/chat route with optional protection...");
app.post("/api/chat", protect.optional, giveAnswer);

// Serve Frontend Build
app.use(express.static(path.join(__dirname, "Client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Client/dist/index.html"));
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT ${PORT}`.bgBlue.white);
});
