import "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { requireSignin } from "./utils/authMiddleware.js";
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Public Routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "This is the backend of social media app",
    success: true,
  });
});
app.use("/api/v1/auth", authRoutes);

// Private Routes
app.use("/api/v1/users", requireSignin, userRoutes);
app.use("/api/v1/posts", requireSignin, postRoutes);

//Server Start
const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
