const asyncHandler = require("express-async-handler");
const Task =require("../models/taskModel")







/**
* Get project task completion statistics.
*
* This controller calculates the completion percentage of tasks
* for a given project by counting:
* - Total tasks in the project
* - Tasks with status "To Do"
* - Tasks with status "Done"
*
* Formula:
* completionPercentage = (doneTasks / totalTasks) * 100
*
* Route:
* GET /api/projects/:id/progress
*
* @async
* @function getPercentageOfTasks
* @param {Object} req - Express request object.
* @param {Object} req.params - Request parameters.
* @param {string} req.params.id - Project ID.
* @param {Object} res - Express response object.
*
* @returns {Object} 200 - Project task statistics.
* @returns {string} returns.projectId - Project ID.
* @returns {number} returns.totalTasks - Total number of tasks.
* @returns {number} returns.ToDoTasks - Number of pending tasks.
* @returns {number} returns.percentage - Completion percentage.
*/
const getPercentageOfTasks = asyncHandler(async(req,res)=>{
  // Extract project ID from request parameters
   const id=req.params.id;
   // Available task statuses
  const status=["To Do","Done"];
// Execute all count queries concurrently to improve performance.
const [totalTasks, ToDoTasks, DoneTasks] = await Promise.all([
  // Count all tasks belonging to the project.
Task.countDocuments({ projectId: id }),
// Count tasks that are still pending.
Task.countDocuments({ projectId: id, status: status[0]}),
// Count tasks that have been completed.
Task.countDocuments({ projectId: id, status: status[1] })
]);
// Calculate project completion percentage
// Return 0 if no tasks exist to prevent division by zero
  const percentage = totalTasks > 0 ? (DoneTasks / totalTasks) * 100 : 0;
  // Send project progress information
  res.status(200).json({
    projectId: id,
    totalTasks,
    ToDoTasks,
    percentage, })
});






/**
* Retrieve all tasks for a specific project.
*
* This controller fetches all tasks associated with the
* project ID provided in the request parameters and returns
* them as a JSON response.
*
* Route:
* GET /api/projects/:id/tasks
*
* @async
* @function getTask
*
* @param {Object} req - Express request object.
* @param {Object} req.params - Request route parameters.
* @param {string} req.params.id - Unique identifier of the project.
*
* @param {Object} res - Express response object.
*
* @returns {Array<Object>} 200 - List of tasks belonging to the project.
*
* @example
* GET /api/projects/64f8b23a1c2d4e5f6789/tasks
*
* Response:
* [
* {
* "_id": "65a123456789abcd",
* "title": "Create API endpoints",
* "status": "Done",
* "projectId": "64f8b23a1c2d4e5f6789"
* },
* {
* "_id": "65a987654321dcba",
* "title": "Design dashboard",
* "status": "To Do",
* "projectId": "64f8b23a1c2d4e5f6789"
* }
* ]
*/
const getTask = asyncHandler(async (req, res) => {
 // Extract project ID from request parameters.
  const id = req.params.id;
  // Retrieve all tasks associated with the specified project.
  const tasks = await Task.find({projectId:id});
  // Return the list of tasks.
  res.status(200).json(tasks);
  
});




/**
* Create a new task.
*
* This controller creates a new task using the data provided
* in the request body. The task is associated with a project
* and may optionally include a deadline.
*
* Required fields:
* - title
* - projectId
* - status
*
* Optional fields:
* - deadline
*
* Route:
* POST /api/tasks
*
* @async
* @function postTask
*
* @param {Object} req - Express request object.
* @param {Object} req.body - Request payload.
* @param {string} req.body.title - Title of the task.
* @param {string} req.body.projectId - ID of the project associated with the task.
* @param {string} req.body.status - Current status of the task.
* @param {Date|string} [req.body.deadline] - Optional deadline for task completion.
*
* @param {Object} res - Express response object.
*
* @returns {Object} 200 - Successfully created task.
* @returns {string} returns.message - Success message.
* @returns {Object} returns.task - Newly created task document.
*
* @throws {Error} 400 - Thrown when one or more required fields are missing.
*
* @example
* POST /api/tasks
*
* Request Body:
* {
* "title": "Implement authentication",
* "projectId": "64f8b23a1c2d4e5f6789",
* "status": "To Do",
* "deadline": "2026-12-31"
* }
*
* Response:
* {
* "message": "Task was created",
* "task": {
* "_id": "65a123456789abcd",
* "title": "Implement authentication",
* "projectId": "64f8b23a1c2d4e5f6789",
* "status": "To Do",
* "deadline": "2026-12-31"
* }
* }
*/
const postTask = asyncHandler(async (req, res) => {
  // Extract task data from the request body.
   const{title ,projectId ,status ,deadline} = req.body;
  // Validate required fields.
   if ( !title || !projectId || !status) {
    res.status(400);
    throw new Error("Missing body");
  }
  // Create a new task in the database.
// If no deadline is provided, store null.
  const createTask = await Task.create({ title, projectId, status, deadline: deadline || null });
 
  res.status(201).json({message:"Task was created "},createTask);
 
});






/**
* Update an existing task.
*
* This controller updates one or more fields of an existing task.
* Only the fields provided in the request body will be updated.
*
* Updatable fields:
* - title
* - status
* - deadline
*
* Route:
* PUT /api/tasks/:id
*
* @async
* @function putTask
*
* @param {Object} req - Express request object.
* @param {Object} req.params - Request route parameters.
* @param {string} req.params.id - Unique identifier of the task.
*
* @param {Object} req.body - Request payload.
* @param {string} [req.body.title] - Updated task title.
* @param {string} [req.body.status] - Updated task status.
* @param {Date|string|null} [req.body.deadline] - Updated task deadline.
*
* @param {Object} res - Express response object.
*
* @returns {Object} 200 - Successfully updated task.
* @returns {string} returns.message - Success message.
* @returns {Object} returns.task - Updated task document.
*
* @throws {Error} 404 - Task not found.
*
* @example
* PUT /api/tasks/65a123456789abcd
*
* Request Body:
* {
* "title": "Update API documentation",
* "status": "Done",
* "deadline": "2026-12-31"
* }
*
* Response:
* {
* "message": "Updated task 65a123456789abcd",
* "task": {
* "_id": "65a123456789abcd",
* "title": "Update API documentation",
* "status": "Done",
* "deadline": "2026-12-31"
* }
* }
*/
const putTask = asyncHandler(async (req, res) => {
  // Extract task ID from route parameters.
  const id = req.params.id;
  // Extract updatable fields from the request body.
  const { title, status,deadline } = req.body;

  // Build update object dynamically to update only provided fields.
  const updateData = {};
  if (title) updateData.title = title;
  if (status) updateData.status = status;
  if (deadline !== undefined) updateData.deadline = deadline || null;

  // Find the task by ID and apply updates.
// The 'new: true' option returns the updated document.
  const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
// Throw an error if no task exists with the given ID.
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

// Return the updated task.
  res.status(200).json({ message: `Updated task ${id}`, task });
});





/**
* Delete a task by its ID.
*
* This controller removes a task from the database using
* the task ID provided in the request parameters.
*
* Route:
* DELETE /api/tasks/:id
*
* @async
* @function deleteTask
*
* @param {Object} req - Express request object.
* @param {Object} req.params - Request route parameters.
* @param {string} req.params.id - Unique identifier of the task to delete.
*
* @param {Object} res - Express response object.
*
* @returns {Object} 200 - Task deleted successfully.
* @returns {string} returns.message - Success message.
*
* @throws {Error} 404 - Thrown when no task exists with the given ID.
*
* @example
* DELETE /api/tasks/65a123456789abcd
*
* Response:
* {
* "message": "Task deleted successfully"
* }
*/
const deleteTask = asyncHandler(async (req, res) => {
  // Extract task ID from route parameters.
  const id = req.params.id; 
// Find the task by ID and remove it from the database.
  const task = await Task.findByIdAndDelete(id);
// Throw an error if the task does not exist.
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = {  getTask, postTask, putTask, deleteTask, getPercentageOfTasks };