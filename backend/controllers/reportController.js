import Project from "../models/projectModel.js";
import Report from "../models/reportModel.js";

// PATH :   localhost:5000/api/reports/create
// sample report
/* {
  "projectId": "67ed46b9fa3698e1047fe0eb",
  "name": "Phase 1 Initial Report",
  "description": "Detailed status report covering project initiation, requirement gathering, and initial planning phase.",
  "proofs": [
    "https://drive.example.com/proofs/phase1-plan.pdf",
    "https://imgur.com/project-snapshot.png"
  ],
  "startDate": "2025-04-01"
}
*/

export const createReport = async (req, res) => {
  try {
    const { projectId, name, description, proofs, startDate } = req.body;

    // ❗ Use findById to get a single document
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ status: 404, message: "Project not found" });
    }

    // 📝 Create the new report
    const report = new Report({
      name,
      description,
      proofs,
      startDate,
      project: project._id,
    });

    // 📎 Push report._id to project.proofs
    project.reports.push(report._id);

    // 💾 Save both
    await Promise.all([report.save(), project.save()]);

    // 📦 Populate reports if needed
    const populatedProject = await Project.findById(projectId).populate(
      "reports"
    );

    res.status(200).json({
      message: "Report generated successfully ✅",
      status: 200,
      project: populatedProject,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Something went wrong 💥" });
  }
};

// localhost:5000/api/report/:id
// id - projectID
export const getReports = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("reports");

    if (!project) {
      return res
        .status(404)
        .json({ status: 404, message: "Project not found" });
    }

    res.json({
      status: 200,
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};
