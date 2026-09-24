const {validationResult, check } = require('express-validator');

// Single middleware function
const userValidator = [
  check('username')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 6 }).withMessage('Name must be at least 6 characters')
    .notEmpty().withMessage('Empty user name')
    .toLowerCase()
    .trim(),

  check('email')
 .notEmpty()
 .trim()
 .isEmail().withMessage('Invalid email format'),
 
 check('password')
 .notEmpty().withMessage('password Empty password')
 .isString()
 .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol'),

  // Final middleware to check results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); 
  }
];

module.exports = userValidator;




