const express = require('express');
const router = express.Router();
const task = require('../Controllers/taskController');
const { validateToken } = require('../middleware/validateTokenHandler');
const taskValidator = require('../Validator/taskValidator');


// Protect all task routes by requiring a valid authentication token
router.use(validateToken);
// Validate task request data before processing any task operation
router.use(taskValidator);
// Define CRUD routes for tasks and an endpoint to retrieve task completion percentage
router.route('/').post( task.postTask);
router.route('/:id')
	.get( task.getTask)
	.put( task.putTask)
	.patch( task.putTask)
	.delete(task.deleteTask);
router.route('/percentage/:id').get( task.getPercentageOfTasks);

module.exports = router;