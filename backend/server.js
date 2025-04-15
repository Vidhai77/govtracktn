import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { connectDb } from "./config/connectDb.js";
import projectRoutes from "./routes/projectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
dotenv.config(); // Load environment variables
import userRoutes from "./routes/userRoutes.js";
connectDb();
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
); // Enable CORS (optional, for frontend)

app.use("/api/auth", authRoutes); // Renaming it to /auth since it's for authentication
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
