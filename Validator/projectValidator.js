const { validationResult, check } = require('express-validator');
/**
* Validation middleware for Project-related requests.
*
* Validates the following fields:
* - id (optional): Must be a valid MongoDB ObjectId.
* - title (optional): Must be a non-empty string after trimming whitespace.
* - context (optional): Must be a string.
*
* If validation fails, returns a 400 response with the validation errors.
* Otherwise, passes control to the next middleware.
*/
const projectValidator=[
    check('id')
    .optional()
    .notEmpty().withMessage('Project id is required')
    .isMongoId().withMessage('Project id must be valid'),

    check('title')
    .optional()
    .isString().withMessage('Project title must be a string')
    .trim()
    .notEmpty().withMessage('Project title cannot be empty'),

    check('context')
    .optional()
    .isString().withMessage('Project context must be a string')
    .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }


];

module.exports = projectValidator;