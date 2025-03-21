import User from "../models/userModels.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Constants
const VALID_ROLES = ["Collector", "Department_Head", "Tender_Group"];
const SALT_ROUNDS = 12;

// Helper function for validation
const validateUserInput = ({ role, department, district }) => {
  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid role specified");
  }

  if (role !== "Tender_Group" && !department) {
    throw new Error("Department is required for this role");
  }

  if (!district) {
    throw new Error("District is required");
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerController = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, department, district } = req.body;
  const normalizedEmail = email.toLowerCase();

  // Validate inputs
  try {
    validateUserInput({ role, department, district });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // Check for existing user
  const userExists = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone }],
  });

  if (userExists) {
    return res
      .status(400)
      .json({ message: "Email or phone number already in use" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user with conditional fields
  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role,
    ...(role !== "Tender_Group" && {
      department,
      district,
    }),
  });

  // Response
  if (!user) {
    throw new Error("Server error. Could not create user.");
  }

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    district: user.district,
    token: generateToken(user._id),
  };

  res.status(201).json(userResponse);
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  // Find user and select only necessary fields
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  ); // Explicitly select password field

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Update last login
  user.updatedAt = new Date();
  await user.save();

  // Prepare response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    district: user.district,
    token: generateToken(user._id),
    message: "Login successful",
  };

  res.json(userResponse);
});
