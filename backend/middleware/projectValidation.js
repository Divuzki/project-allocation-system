const Project = require('../models/Project');

// Check if project title already exists
exports.checkDuplicateTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    
    // Skip check if no title provided (other validators will catch this)
    if (!title) {
      return next();
    }
    
    // Check if project with same title exists
    const existingProject = await Project.findOne({ title: title });
    
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project with this title already exists. Please choose a different title.'
      });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error checking for duplicate project title',
      error: err.message
    });
  }
};

// Validate project input
exports.validateProjectInput = (req, res, next) => {
  const { title, description, supervisor } = req.body;
  
  // Check required fields
  if (!title || !description || !supervisor) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, description and supervisor'
    });
  }
  
  // Check title length
  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot be more than 100 characters'
    });
  }
  
  // Check description length
  if (description.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Description cannot be more than 1000 characters'
    });
  }
  
  next();
};