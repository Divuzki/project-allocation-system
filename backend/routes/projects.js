const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const { checkDuplicateTitle, validateProjectInput } = require('../middleware/projectValidation');

// @route   GET /api/projects/check-title
// @desc    Check if a project title already exists
// @access  Private (Students only)
router.get('/check-title', protect, authorize('student'), async (req, res) => {
  try {
    let { title } = req.query;

    title = `${title}`.trim().toLowerCase()
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    const existingProject = await Project.findOne({ title: title });
    
    return res.status(200).json({
      success: true,
      exists: !!existingProject
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error checking project title',
      error: err.message
    });
  }
});

// @route   POST /api/projects
// @desc    Submit a new project
// @access  Private (Students only)
router.post(
  '/',
  protect,
  authorize('student'),
  validateProjectInput,
  checkDuplicateTitle,
  async (req, res) => {
    try {
      // Add student ID to project
      req.body.student = req.user.id;
      
      const project = await Project.create(req.body);
      
      res.status(201).json({
        success: true,
        data: project
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error submitting project',
        error: err.message
      });
    }
  }
);

// @route   GET /api/projects
// @desc    Get all projects (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query;
    
    // If student, only show their projects
    if (req.user.role === 'student') {
      query = Project.find({ student: req.user.id });
    }
    // If supervisor, only show projects assigned to them
    else if (req.user.role === 'supervisor') {
      query = Project.find({ supervisor: req.user.id });
    }
    // If admin, show all projects
    else {
      query = Project.find({});
    }
    
    // Execute query with population
    const projects = await query
      .populate({
        path: 'student',
        select: 'name email'
      })
      .populate({
        path: 'supervisor',
        select: 'name email'
      });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving projects',
      error: err.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'student',
        select: 'name email'
      })
      .populate({
        path: 'supervisor',
        select: 'name email'
      });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has access to this project
    if (
      (req.user.role === 'student' && (!project.student || project.student._id.toString() !== req.user.id)) ||
      (req.user.role === 'supervisor' && (!project.supervisor || project.supervisor._id.toString() !== req.user.id)) ||
      (req.user.role !== 'admin' && req.user.role !== 'student' && req.user.role !== 'supervisor')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project',
      error: err.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project (status, feedback)
// @access  Private (Supervisors and Admins only)
router.put(
  '/:id',
  protect,
  authorize('supervisor', 'admin'),
  async (req, res) => {
    try {
      let project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      // Check if supervisor is assigned to this project
      if (
        req.user.role === 'supervisor' &&
        (!project.supervisor || project.supervisor._id.toString() !== req.user.id)
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this project'
        });
      }
      
      // Only allow updating status and feedback
      const { status, feedback } = req.body;
      const updateData = {};
      
      if (status) updateData.status = status;
      if (feedback) updateData.feedback = feedback;
      
      project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: err.message
      });
    }
  }
);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
      
      await Project.findByIdAndDelete(req.params.id);
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: err.message
      });
    }
  }
);

module.exports = router;