import express from "express";
import dotenv from "dotenv";
import colors from "colors";
// Local Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/dbConfig.js";
import errorHandler from "./Middleware/errorHandler.js";
import eventRoutes from "./routes/eventRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import giveAnswer from "./controller/chatController.js";
import protect from "./Middleware/authMiddleware.js";

dotenv.config();

//DB CONNECTION
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

//Body-Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "WELCOME TO MOODGO API",
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

//Admin Routes
app.use("/api/admin", adminRoutes);

// Event Routes
app.use("/api/events", eventRoutes );

// Order Routes
app.use("/api/order", orderRoutes)

// Comment Routes
app.use("/api/comment", commentRoutes)

// Chat Routes
app.post("/api/chat", protect.forUser,  giveAnswer)

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT ${PORT}`.bgBlue.white);
});
