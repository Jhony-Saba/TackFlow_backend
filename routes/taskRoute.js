const express = require('express');
const router = express.Router();
const task = require('../Controllers/taskController');
const { validateToken } = require('../middleware/validateTokenHandler');
const taskValidator = require('../Validator/taskValidator');

router.use(validateToken);
router.use(taskValidator);
router.route('/').post( task.postTask);
router.route('/:id')
	.get( task.getTask)
	.put( task.putTask)
	.patch( task.putTask)
	.delete(task.deleteTask);
router.route('/percentage/:id').get( task.getPercentageOfTasks);

module.exports = router;