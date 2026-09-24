const express =require("express");
const router =express.Router();
const user =require("../Controllers/userController")
const uservalidator =require("../Validator/uservalidator")




router.route("/current").get(user.CurrentUser)
router.route("/register").post(uservalidator , user.Register)
router.route("/login").post(uservalidator,user.Login)



 
module.exports =router
