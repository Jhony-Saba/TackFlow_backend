const express =require("express");
// Create a new router object to handle user-related routes
const router =express.Router();
// Import user controller functions (Register, Login, CurrentUser)
const user =require("../Controllers/userController")
// Import validation middleware for user requests
const uservalidator =require("../Validator/uservalidator")



/**
* User Routes
* Defines all routes related to user authentication and profile actions.
*/
router.route("/current").get(user.CurrentUser)
router.route("/register").post(uservalidator , user.Register)
router.route("/login").post(uservalidator,user.Login)



// Export the router so it can be used in the main application
module.exports =router
