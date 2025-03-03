import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv'
dotenv.config();
// Middleware to optionally attach req.user if token is provided
export const protect = asyncHandler(async (req, res, next) => {
    console.log('howdy');
    
  const authHeader = req.headers.authorization;
  
  // If no Authorization header or not Bearer, proceed without req.user
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null; // Explicitly set to null for clarity
      return next();
    }
    
    const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach user if valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded._id).select('-password');
    

    if (!req.user) {
      req.user = null; // User not found, proceed anyway
    }
  } catch (error) {
    // If token is invalid/expired, proceed without req.user
    req.user = null;
  }

  next();
});