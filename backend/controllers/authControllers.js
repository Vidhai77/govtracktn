import User from '../models/userModels.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerController = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, department, district } = req.body;

  // Convert email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Validate role
  const validRoles = ['Collector', 'Department_Head', 'Tender_Group', 'Admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  // Ensure department is provided for specific roles
  if (role !== 'Admin' && !department) {
    return res.status(400).json({ message: 'Department is required for this role' });
  }

  // Ensure district is provided
  if (!district) {
    return res.status(400).json({ message: 'District is required' });
  }

  // Check if email or phone already exists
  const userExists = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
  if (userExists) {
    return res.status(400).json({ message: 'Email or phone number already in use' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role,
    department: role === 'Tender_Group' ? null : department,
    district: role === 'Tender_Group' ? null : department,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      district: user.district,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).json({ message: 'Server error. Could not create user.' });
  }
});

/* 
Sample request body for Register:
{
  "name": "Arun Kuwmar",
  "email": "arun.kuwmaasr@gov.in",
  "phone" : "+91109424234",
  "password": "SecurePass123!",
  "role": "Department_Head",
  "department": "Public Works",
  "district" : "Madurai"
  
}

 */

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find user by email or phone

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Update `updatedAt` field when user logs in
  user.updatedAt = new Date();
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email.toLowerCase(),
    phone: user.phone,
    role: user.role,
    department: user.department,
    district: user.district,
    token: generateToken(user._id),
  });
});

/*
    * Sample request body for Login:
    {
 "email": "arun.kuwmaasr@gov.in",
  "password": "SecurePass123!",

*/
