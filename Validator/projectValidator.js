const { validationResult, check } = require('express-validator');

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