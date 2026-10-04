const { validationResult, check } = require('express-validator');
JavaScript
/**
* Validation middleware for Task-related requests.
*
* Validates the following fields:
* - id (optional): Must be a valid MongoDB ObjectId.
* - title (required for POST requests, optional for updates): Must be a non-empty string.
* - projectId (required for POST requests, optional for updates): Must be a valid MongoDB ObjectId.
* - status (required for POST requests, optional for updates): Must be one of:
* 'To Do', 'In Progress', or 'Done'.
* - deadline (optional): Must be a valid ISO 8601 date.
*
* Returns a 400 Bad Request response with validation errors if any
* validation rule fails. Otherwise, passes control to the next middleware.
*/
const taskValidator = [
	check('id')
		.optional()
		.notEmpty().withMessage('Task id is required')
		.isMongoId().withMessage('Task id must be valid'),

	check('title')
		.if((value, { req }) => req.method === 'POST' || value !== undefined)
		.notEmpty().withMessage('Task title is required')
		.isString().withMessage('Task title must be a string')
		.trim(),

	check('projectId')
		.if((value, { req }) => req.method === 'POST' || value !== undefined)
		.notEmpty().withMessage('Project id is required')
		.isMongoId().withMessage('Project id must be valid'),

	check('status')
		.if((value, { req }) => req.method === 'POST' || value !== undefined)
		.notEmpty().withMessage('Task status is required')
		.isIn(['To Do', 'In Progress', 'Done'])
		.withMessage('Task status must be To Do, In Progress, or Done'),

	check('deadline')
		.optional({ nullable: true })
		.isISO8601().withMessage('Task deadline must be a valid date'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	}
];

module.exports = taskValidator;
