// Import express-async-handler to automatically catch async errors
const asyncHandler =require('express-async-handler')
// Import jsonwebtoken package for token verification
const jwt =require('jsonwebtoken')




/**
* Authentication Middleware
*
* Validates the JWT token sent in the Authorization header.
*
* Expected header format:
* Authorization: Bearer <token>
*
* Workflow:
* 1. Extract the token from the Authorization header.
* 2. Verify the token using the JWT secret key.
* 3. If the token is valid, attach the decoded payload to req.user.
* 4. If the token is missing or invalid, return a 401 Unauthorized error.
*
* @middleware
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
* @returns {void}
*/
const validateToken = asyncHandler(async(req,res,next)=>{

// Variable to store the extracted JWT token
let token;
// Retrieve the Authorization header from the request
let authHeader = req.header('Authorization'||'authoration');



// Check if Authorization header exists and starts with "Bearer "
if(authHeader && authHeader.startsWith('Bearer ')){
// Extract the token part after "Bearer "
token=authHeader.split(" ")[1];
// Verify the token using the secret key
jwt.verify(token,process.env.ASSECC_TOKEN_SECRET,(err,decode)=>{
 // If token verification fails 
  if(err){
        res.status(401);
        throw new  Error("User is not authorised")
     } 
// Store decoded user information in the request object
    req.user = decode;
// Proceed to the next middleware or route handler
      next();

})}else {
  // Authorization header is missing or incorrectly formatted
    res.status(401);
    throw new Error("Authorization header missing or invalid");
  }
})
// Export middleware for use in protected routes
module.exports={validateToken};
