const express =require("express");
// Create a new router object to handle user-related routes
const router =express.Router();
// Import user controller functions (Register, Login, CurrentUser)
const user =require("../Controllers/userController")
// Import validation middleware for user requests
const uservalidator =require("../Validator/uservalidator")
const{validateSingUpToken} = require('../middleware/validateTokenHandler');


/**
* User Routes
* Defines all routes related to user authentication and profile actions.
*/
router.use(uservalidator);
router.route("/register/request").post( user.registerRequest);
router.route("/register/verify").post(validateSingUpToken ,user.verifyRegister);
router.route("/login").post(user.Login);




// Export the router so it can be used in the main application
module.exports =router
