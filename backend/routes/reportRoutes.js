import express from "express";
import { createReport, getReports } from "../controllers/reportController.js";

const router = express.Router();

// 📝 POST a new report for a project
router.post("/create", createReport);

// 📥 GET all reports for a project by project ID
router.get("/:id", getReports);

export default router;
