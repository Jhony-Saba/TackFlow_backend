const express = require('express');
const project = require('../Controllers/projectController');
const {validateToken} =require('../middleware/validateTokenHandler')
const projectValidator = require('../Validator/projectValidator');
const router = express.Router();
// Protect all project routes by requiring a valid authentication token
router.use(validateToken);
// Validate project request data before processing any project operation
router.use(projectValidator);

// Define CRUD routes for projects and an endpoint 
router.route('/')
                  .get( project.getProjects)
                  .post( project.createProject);
router.route('/:id')
                  .put( project.putProject)
                  .delete(project.deleteProject);

module.exports = router;
