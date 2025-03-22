import Project from "../models/projectModel.js";
import User from "../models/userModels.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  console.log(projects);
  res.json(projects);
});

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json(project);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
// createProjectByCollector
export const createProjectByCollector = asyncHandler(async (req, res) => {
  console.log("Hi");

  const { name, description, status, startDate, deadline, department, budget } =
    req.body;

  if (
    ![name, description, status, startDate, deadline, department, budget].every(
      Boolean,
    )
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Fetch department head
  const departmentHead = await User.findOne({
    role: "Department_Head",
    district: req.user.district, // ✅ Fixed district filtering
    department: department,
  });

  // Debugging: Check if department heads exist
  const depthds = await User.find({
    role: "Department_Head",
    district: req.user.district, // ✅ Correct district filtering
  });

  console.log(depthds);

  const project = new Project({
    name,
    description,
    status,
    budget,
    startDate,
    deadline,
    district: req.user.district,
    department,
    departmentHead: departmentHead ? departmentHead._id : null,
    createdBy: req.user ? req.user._id : null,
  });

  console.log(project);

  // Save project and associate it with the department head if they exist
  if (departmentHead) {
    departmentHead.projects.push(project._id); // ✅ Ensure this field exists in schema
    await departmentHead.save(); // ✅ Save only if `departmentHead` exists
  }

  console.log(departmentHead);
  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

//   Sample Request
{
  /**
    name: "Road Construction",
    description: "Construction of a 10km road",
    status: "Pending",
    startDate: "2021-09-01",
    deadline: "2022-09-01",
    department: "Works",
    budget: 1000000
    

    */
}

// @desc    Assign project to tenderer
// @route   PUT /api/projects/:id/assign-tenderer
// @access  Private
export const assignProjectToTenderer = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  // Start MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let tenderer = await User.findOne({ email }).session(session);

    if (!tenderer) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash("password", salt);

      tenderer = new User({
        name,
        email,
        phone,
        role: "Tender_Group",
        password: hashedPassword,
      });

      await tenderer.save({ session });
    }

    const project = await Project.findById(req.params.id).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Project not found" });
    }

    project.tenderer = tenderer._id;
    tenderer.assignedProject = project._id;
    tenderer.projects.push(project._id);

    await Promise.all([tenderer.save({ session }), project.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    res.json(project);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const {
    name,
    description,
    status,
    startDate,
    deadline,
    district,
    department,
    departmentHead,
    tenderer,
  } = req.body;

  // ✅ Remove project from old department head (if department is changing)
  if (
    department &&
    department !== project.department &&
    project.departmentHead
  ) {
    await User.findByIdAndUpdate(project.departmentHead, {
      $pull: { projects: project._id },
    });
  }

  // ✅ Update project fields dynamically
  Object.assign(project, {
    name: name ?? project.name,
    description: description ?? project.description,
    status: status ?? project.status,
    startDate: startDate ?? project.startDate,
    deadline: deadline ?? project.deadline,
    district: district ?? project.district,
    department: department ?? project.department,
    departmentHead: departmentHead ?? project.departmentHead,
    tenderer: tenderer ?? project.tenderer,
  });

  // ✅ Assign project to new department head (if changed)
  if (departmentHead) {
    await User.findByIdAndUpdate(departmentHead, {
      $addToSet: { projects: project._id },
    });
  }

  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // ✅ Remove project reference from Department Head
  if (project.departmentHead) {
    await User.findByIdAndUpdate(project.departmentHead, {
      $pull: { projects: project._id },
    });
  }

  // ✅ Remove project reference from Tenderer
  if (project.tenderer) {
    await User.findByIdAndUpdate(project.tenderer, {
      $unset: { assignedProject: 1 }, // Remove assigned project field
      $pull: { projects: project._id }, // Remove from project list
    });
  }

  // ✅ Delete project
  await project.deleteOne();
  res.json({ message: "Project removed successfully" });
});

// @desc    Get projects by district
// @route   GET /api/projects/district/:district
// @access  Public
export const getProjectsByDistrict = asyncHandler(async (req, res) => {
  // console.log(req.params);
  const projects = await Project.find({ district: req.params.district });
  // console.log(projects);
  res.json(projects);
});

// @desc    Get projects by department
// @route   GET /api/projects/department/:department
// @access  Public
export const getProjectsByDepartment = asyncHandler(async (req, res) => {
  console.log("Hello da");
  const { department } = req.params;
  console.log(department);
  const projectIds = req.user.projects; // Array of project IDs
  console.log("Project IDs:", projectIds);

  // Fetch full projects from DB
  const projects = await Project.find({ _id: { $in: projectIds } });

  console.log("Fetched Projects:", projects);
  res.json(projects);
});

// @desc    Get projects by department head
// @route   GET /api/projects/departmentHead/:departmentHead
// @access  Public
export const getProjectsByDepartmentHead = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  const projects = await Project.find({
    district: req.user.district,
    department: req.user.department,
  });
  res.json(projects);
});

// @desc    Get projects by tenderer
// @route   GET /api/projects/tenderer/:tenderer
// @access  Public
export const getProjectsByTenderer = asyncHandler(async (req, res) => {
  const projects = await Project.find({ tenderer: req.params.tenderer });
  res.json(projects);
});
