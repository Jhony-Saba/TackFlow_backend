const asyncHandler = require("express-async-handler");
const bcrypt = require("../node_modules/bcrypt");
const jwt =require('../node_modules/jsonwebtoken');
const User = require("../models/userModel");
const saveUser =require('../Services/User/tempStorage');
const emailService=require("../Services/Email/service");


const registerRequest=asyncHandler(async(req,res)=>{
 

  const { username, password,email, role } = req.body;


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

const userData={
    username,
    password,
    role,
  };

  // Store registration data temporarily
  // saveUser.saveRegistration(email, userData);
  // Send OTP email
  const emailResult = await emailService.send_verification(email);
 
  if(!emailResult.success || !(saveUser.saveRegistration(email, userData)) ){
    res.status(500);
    throw new Error("Failed to save registration data");}
    accessToken= await jwt.sign({email : {
  email }},
  process.env.ASSECC_TOKEN_SECRET,
  {expiresIn :process.env.TIMER}
);


// Return the access token to the client.
res.status(200).json({accessToken,
    success: true,
    message: "Verification code sent to your email",
  })
});

const verifyRegister =asyncHandler(async(req,res)=>{

 const {otp}= req.body;
 const {email} =req.email.email;

   // Check if a user with the same username OR email exists
const userAvailable = await User.findOne({email});
if(userAvailable ){
res.status(403);

throw new Error ("User already registered !");

}
 
 const currentUser = await  saveUser.getRegistration(email);
 
    if (!currentUser) {
     
      res.status(404);
       throw new Error("The user not  found it .");
    }
const verifyEmail= await emailService.verify_code(email,otp);

 if( verifyEmail.success ===true   ){


// Hash the password using bcrypt before saving it to the database.
// The value 10 represents the salt rounds.
const HashPassword=await bcrypt.hash(currentUser.password,10);
 // Create the user
const createUser = await User.create({ username:currentUser.username, password:HashPassword ,email , role:currentUser.role });


// Store the created user object in a local variable.
const user =createUser;

if(user){
saveUser.deleteRegistration(email);
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



 }else{
  res.status(404);
  throw new Error("otp not correct ");
 }

 





})

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

module.exports = {registerRequest,verifyRegister, Login};
