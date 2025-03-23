import express from "express";
import {
  getAllUsers,
  getUserByAuth,
  getUserById,
  getUsersByDepartment,
  getUsersByDistrict,
  getUsersByRole,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// get all users , by department , by district

router.route("/").get(getAllUsers);
router.route("/auth").get(protect, getUserByAuth);
router.route("/role/:role").get(getUsersByRole);
router.route("/department/:department").get(getUsersByDepartment);
router.route("/district/:district").get(getUsersByDistrict);
router.route("/:id").get(getUserById);
export default router;
