import Project from '../models/projectModel.js';
import User from '../models/userModels.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({});
    res.json(projects);
});

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    res.json(project);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
// createProjectByCollector
export const createProjectByCollector = asyncHandler(async (req, res) => {
    const { name, description, status, startDate, deadline, department,budget } = req.body;
  
    console.log(req.user);
    
    const departmentHead =await User.findOne({ role: 'Department_Head' ,district:req.user.district });

    console.log(departmentHead);
    
   if(!name){
        res.status(400);
        throw new Error('Name is required');
    }

   if(!description){
        res.status(400);
        throw new Error('Description is required');
    }
   if(!status){
        res.status(400);
        throw new Error('Status is required');
    }
    if(!startDate){
        res.status(400);
        throw new Error('Start Date is required');
    }
    if(!deadline){
        res.status(400);
        throw new Error('Deadline is required');
    }
    if(!department){
        res.status(400);
        throw new Error('Department is required');
    }
    if(!budget){
        res.status(400);
        throw new Error('Budget is required');
    }
    

    console.log(req.user.district);
    
    const project = new Project({
      name,
      description,
      status,
      budget,
      startDate,
      deadline,
      district : req.user.district,
      department,
      departmentHead,
      createdBy: req.user ? req.user._id : null // Use null if no user
    });
  
    console.log(project);
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  });

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
                role: 'Tender_Group',
                password: hashedPassword
            });

            await tenderer.save({ session });
        }

        const project = await Project.findById(req.params.id).session(session);
        if (!project) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Project not found' });
        }

        project.tenderer = tenderer._id;
        tenderer.assignedProject = project._id;

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
        throw new Error('Project not found');
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
        createdBy
    } = req.body;

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.startDate = startDate || project.startDate;
    project.deadline = deadline || project.deadline;
    project.district = district || project.district;
    project.department = department || project.department;
    project.departmentHead = departmentHead || project.departmentHead;
    project.tenderer = tenderer || project.tenderer;
    project.createdBy = createdBy || project.createdBy;

    const updatedProject = await project.save();
    res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
});

// @desc    Get projects by district
// @route   GET /api/projects/district/:district
// @access  Public
export const getProjectsByDistrict = asyncHandler(async (req, res) => {
    const projects = await Project.find({ district: req.params.district });
    res.json(projects);
});

// @desc    Get projects by department
// @route   GET /api/projects/department/:department
// @access  Public
export const getProjectsByDepartment = asyncHandler(async (req, res) => {
    const projects = await Project.find({ department: req.params.department });
    res.json(projects);
});

// @desc    Get projects by department head
// @route   GET /api/projects/departmentHead/:departmentHead
// @access  Public
export const getProjectsByDepartmentHead = asyncHandler(async (req, res) => {
    const projects = await Project.find({ departmentHead: req.params.departmentHead });
    res.json(projects);
});

// @desc    Get projects by tenderer
// @route   GET /api/projects/tenderer/:tenderer
// @access  Public
export const getProjectsByTenderer = asyncHandler(async (req, res) => {
    const projects = await Project.find({ tenderer: req.params.tenderer });
    res.json(projects);
});


