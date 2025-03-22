// user controller
import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// get users by role
export const getUsersByRole = asyncHandler(async (req, res) => {
  const role = req.params.role;
  const users = await User.find({ role: role });
  res.json(users);
});

//  get users by department
export const getUsersByDepartment = asyncHandler(async (req, res) => {
  const department = req.params.department;
  const users = await User.find({ department: department });
  res.json(users);
});

// get users by district
export const getUsersByDistrict = asyncHandler(async (req, res) => {
  const district = req.params.district;
  const users = await User.find({ district: district });
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(id).populate("projects");
  res.json(user);
});
