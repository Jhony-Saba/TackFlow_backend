const mongoose = require('mongoose');
/**
* Project Schema
*
* Represents a project created by a user.
* Each project belongs to a specific user and can contain
* multiple tasks associated with it.
*
* Fields:
* - title: Name of the project.
* - context: Optional description or additional information about the project.
* - userId: Reference to the user who owns the project.
*
* @typedef {Object} Project
* @property {string} title - Project title.
* @property {string} [context] - Optional project description.
* @property {mongoose.Types.ObjectId} userId - ID of the project owner.
*/
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  context: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Project', projectSchema);