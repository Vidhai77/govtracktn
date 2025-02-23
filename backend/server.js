import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectDb } from './config/connectDb.js';

dotenv.config(); // Load environment variables

connectDb();
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS (optional, for frontend)

app.use('/api/auth', authRoutes); // Renaming it to /auth since it's for authentication

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
