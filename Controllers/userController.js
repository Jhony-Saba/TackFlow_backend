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

// hashing password
const HashPassword=await bcrypt.hash(password,10);
 // Create the user
const createUser = await User.create({ username, password:HashPassword ,email , role });


const user =createUser;



//if the user  was created login to the  dashboard
if(user){


Tokenaccess= await jwt.sign({user : {
  userid:user._id,
  username:user.username,
  email :user.email,}},
  process.env.ASSECC_TOKEN_SECRET,
  {expiresIn :process.env.TIMER}
);

req.user= user.encode;
res.status(200).json({Tokenaccess})

}else{
  res.status(500);
  throw new Error ("User creation failed" )
}
});






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

Tokenaccess= await jwt.sign({user : {
  userid:user._id,
  username:user.username,
  email :user.email,}},
  process.env.ASSECC_TOKEN_SECRET,
  {expiresIn :process.env.TIMER}
);


req.user= user.encode;
res.status(200).json({Tokenaccess})


  }else{res.status(400)
        throw new Error("Incorrect  password");     
  }
}else{
  res.status(400);
  throw new Error ("User not found")
}

});

module.exports = { CurrentUser, Register, Login};
