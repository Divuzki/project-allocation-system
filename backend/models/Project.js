const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted'
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  supervisor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  }
});

// Create index on title field for efficient duplicate checks
ProjectSchema.index({ title: 1 });

module.exports = mongoose.model('Project', ProjectSchema);