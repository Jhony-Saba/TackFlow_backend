const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const Task =require('../models/taskModel')



/**
* @desc Get all projects belonging to the authenticated user
* @route GET /api/projects
* @access Private
*
* Retrieves all projects associated with the currently logged-in user
* using the user's ID stored in the authentication payload and returns
* them as a JSON response.
*
* @param {Object} req - Express request object containing authenticated user data.
* @param {Object} res - Express response object.
* @returns {JSON} Array of user projects with HTTP status 200.
*/
const getProjects = asyncHandler(async (req, res) => {
// Extract the authenticated user's information from the request object
const { user } = req.user;
// Find all projects in the database that belong to the current user
const projects = await Project.find({userId:user.userid})
// Send the list of projects back to the client with a 200 (OK) status
res.status(200).json(projects);
});


/**
* @desc Create a new project for the authenticated user
* @route POST /api/projects
* @access Private
*
* Creates a new project using the data provided in the request body.
* The project is associated with the currently logged-in user and
* stored in the database. Returns the newly created project.
*
* @param {Object} req - Express request object containing project data and authenticated user information.
* @param {Object} res - Express response object.
* @returns {JSON} The newly created project with HTTP status 201.
*/
const createProject = asyncHandler(async (req, res) => {
	// Extract project title and context from the request body
  const { title, context } = req.body;
// Validate that a title was provided
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
// Extract the authenticated user's information from the request object
	const { user } = req.user;
// Create a new project and associate it with the current user
  const project = await Project.create({
    title,
    context,
	userId: user.userid
  });
// Return the newly created project with a 201 (Created) status code
  res.status(201).json(project);
});

/**
* @desc Update an existing project owned by the authenticated user
* @route PUT /api/projects/:id
* @access Private
*
* Updates the specified project's title and/or context.
* Only the project owner can update the project. The function
* validates that at least one updatable field is provided and
* returns the updated project document.
*
* @param {Object} req - Express request object containing update data, project ID, and authenticated user information.
* @param {Object} res - Express response object.
* @returns {JSON} The updated project with HTTP status 200.
*/
const putProject = asyncHandler(async (req, res) => {
	// Object that will store only the fields allowed to be updated
	const updates = {};
	// List of fields that users are permitted to modify
	const allowedFields = ['title', 'context'];
	// Extract the authenticated user's information from the request
	const { user } = req.user;
// Copy only allowed fields from the request body into the updates object
	for (const field of allowedFields) {
		if (req.body[field] !== undefined) {
			updates[field] = req.body[field];
		}
	}
// Ensure at least one valid field was provided for updating
	if (Object.keys(updates).length === 0) {
		res.status(400);
		throw new Error('Provide title or context to update');
	}
	// Find the project by ID and user ownership, then update it
	const project = await Project.findOneAndUpdate(
		{ _id: req.params.id, userId: user.userid },
		updates,
		{ new: true,// Return the updated document
		runValidators: true // Apply schema validation to updated fields
	}
	).populate('userId', '-password');
// Throw an error if the project does not exist or does not belong to the user
	if (!project) {
		res.status(404);
		throw new Error('Project not found');
	}
// Return the updated project with a success status code
	res.status(200).json(project);
});
/**
* @desc Delete a project and all associated tasks
* @route DELETE /api/projects/:id
* @access Private
*
* Deletes a project that belongs to the authenticated user.
* If the project is successfully deleted, all tasks associated
* with that project are also removed from the database.
*
* @param {Object} req - Express request object containing the project ID and authenticated user information.
* @param {Object} res - Express response object.
* @returns {JSON} Success or error message with the appropriate HTTP status code.
*/
const deleteProject = asyncHandler(async (req, res) => {
// Extract the authenticated user's information from the request
	const {user}=req.user;
// Ensure that a project ID was provided in the route parameters
	if (!req.params.id){
		res.status(400);
	   throw new Error('Project Id is required');
	  
	}
	// Store the project ID for easier reuse
	const projectId = req.params.id;
	
	  try {
    // Try deleting the project
    const project = await Project.deleteOne({ _id: projectId, userId: user.userid });
// If no project was deleted, the project doesn't exist
// or doesn't belong to the current user
    if (project.deletedCount === 0) {
      // Project not found → skip tasks deletion
      return res.status(404).json({ message: 'Project not found' });
    }

    // If project exists, delete tasks
    await Task.deleteMany({ projectId });

    return res.status(200).json({ message: 'Project deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting project' });
  }
});

module.exports = {
	getProjects,
	createProject,
	putProject,
	deleteProject
};
