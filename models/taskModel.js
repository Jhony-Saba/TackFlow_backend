const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'start' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  deadline: { type: Date, default: null }
});

module.exports = mongoose.model('Task', taskSchema);