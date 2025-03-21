import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Only importing protect, not restrictTo
import {
  getProjects,
  getProjectById,
  createProjectByCollector,
  deleteProject,
  updateProject,
  getProjectsByDistrict,
  getProjectsByDepartment,
  getProjectsByDepartmentHead,
  getProjectsByTenderer,
  assignProjectToTenderer,
} from "../controllers/projectController.js";

const router = express.Router();

// All routes are public but will attach req.user if token is provided
router
  .route("/")
  .get(protect, getProjects) // Public, req.user optional
  .post(protect, createProjectByCollector); // Public, req.user optional

router.route("/department/:department").get(protect, getProjectsByDepartment); // Public, req.user optional
router
  .route("/:id")
  .get(protect, getProjectById) // Public, req.user optional
  .put(protect, updateProject) // Public, req.user optional
  .delete(protect, deleteProject); // Public, req.user optional

router.route("/district/:district").get(protect, getProjectsByDistrict); // Public, req.user optional

router.route("/departmentHead").get(protect, getProjectsByDepartmentHead); // Public, req.user optional

router.route("/tenderer/:tenderer").get(protect, getProjectsByTenderer); // Public, req.user optional

router.route("/:id/assign-tenderer").put(protect, assignProjectToTenderer); // Public, req.user optional

export default router;
