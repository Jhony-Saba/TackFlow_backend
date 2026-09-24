const express = require('express');
const project = require('../Controllers/projectController');
const {validateToken} =require('../middleware/validateTokenHandler')
const projectValidator = require('../Validator/projectValidator');
const router = express.Router();

router.use(validateToken);
router.use(projectValidator);
router.route('/')
                  .get( project.getProjects)
                  .post( project.createProject);
router.route('/:id')
                  .put( project.putProject)
                  .delete(project.deleteProject);

module.exports = router;
