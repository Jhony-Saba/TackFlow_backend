const asyncHandler = require("express-async-handler");
const bcrypt = require("../node_modules/bcrypt");
const jwt =require('../node_modules/jsonwebtoken');
const User = require("../models/userModel");


const CurrentUser = asyncHandler(async (req, res) => {
//   Find a single user in the database by matching the 'userid' from the request parameters,
// and exclude the 'password' field from the returned result for security reasons.
  const user = await User.findOne({ userid: req.params.userid }).select("-password");

// If no user is found in the database, set the HTTP response status to 404 (Not Found)
// and throw an error with the message "User not found" to indicate the requested user does not exist.
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});




/**
* Register a new user.
*
* Workflow:
* 1. Extract user information from the request body.
* 2. Validate that all required fields are provided.
* 3. Check whether the email is already registered.
* 4. Hash the user's password before storing it.
* 5. Create a new user record in the database.
* 6. Generate a JWT access token for the newly registered user.
* 7. Return the access token to allow immediate authentication.
*
* @route POST /api/users/register
* @access Public
*
* @param {Object} req - Express request object containing user data.
* @param {Object} res - Express response object.
*
* @returns {Object} JSON response containing the generated access token.
*
* @throws {400} If required fields are missing.
* @throws {403} If a user with the provided email already exists.
* @throws {500} If user creation fails.
*/
const Register = asyncHandler(async (req, res) => {

// Extract 'username', 'password', 'email', and 'role' fields from the request body.
// This uses object destructuring so each property can be accessed directly
// without repeatedly writing 'req.body.username', 'req.body.password', etc.
  const { username, password,email, role } = req.body;

// Check if any of the required fields (username, password, email, or role) are missing
// from the request body. If at least one is missing, set the HTTP status to 400 (Bad Request)
// and throw an error with the message "Missing body" to indicate invalid input.
  if (!username || !password  ||!email || !role) {
    res.status(400);
    throw new Error("Missing body");
  }



  // Check if a user with the same username OR email exists
const userAvailable = await User.findOne({email});
if(userAvailable ){
res.status(403);

throw new Error ("User already registered !");

}

// Hash the password using bcrypt before saving it to the database.
// The value 10 represents the salt rounds.
const HashPassword=await bcrypt.hash(password,10);
 // Create the user
const createUser = await User.create({ username, password:HashPassword ,email , role });

// Store the created user object in a local variable.
const user =createUser;



/// Ensure the user was successfully created.
if(user){

// Generate a JWT access token containing user information.
Tokenaccess= await jwt.sign({user : {
  userid:user._id,
  username:user.username,
  email :user.email,}},
  process.env.ASSECC_TOKEN_SECRET,
  {expiresIn :process.env.TIMER}
);


// Return the access token to the client.
res.status(200).json({Tokenaccess})

}else{
// User creation failed unexpectedly.
  res.status(500);
  throw new Error ("User creation failed" )
}
});





/**
* Authenticate a user and generate an access token.
*
* Workflow:
* 1. Extract the user's email and password from the request body.
* 2. Validate that both fields are provided.
* 3. Search for a user with the provided email.
* 4. Compare the provided password with the stored hashed password.
* 5. If authentication succeeds, generate a JWT access token.
* 6. Return the access token to the client.
*
* @route POST /api/users/login
* @access Public
*
* @param {Object} req - Express request object containing login credentials.
* @param {Object} res - Express response object.
*
* @returns {Object} JSON response containing the generated access token.
*
* @throws {400} If required fields are missing.
* @throws {400} If the password is incorrect.
* @throws {400} If the user does not exist.
*/
const Login = asyncHandler(async ( req, res) => {
  //get  user email  and password using  body
  const {email,password}=req.body;
   //check if the  email and password  not  empty
  if (!email || !password ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
// if not  empty find the use  where email  is the  email of  the user
const user =await User.findOne({email});
// if the user registered in the database the can login
if(user){
// compare between hashing passwords
const correctPassword = await bcrypt.compare(password,user.password);
//if equals send to the user token  access  
if(correctPassword){
// Generate a JWT access token containing user information.
Tokenaccess= await jwt.sign({user : {
  userid:user._id,
  username:user.username,
  email :user.email,}},
  process.env.ASSECC_TOKEN_SECRET,
  {expiresIn :process.env.TIMER}
);


// Return the generated access token to the client.
res.status(200).json({Tokenaccess})


  }else{
    // Password comparison failed.
    res.status(400)
        throw new Error("Incorrect  password");     
  }
}else{
  // No user was found with the provided email.
  res.status(400);
  throw new Error ("User not found")
}

});

module.exports = { CurrentUser, Register, Login};
