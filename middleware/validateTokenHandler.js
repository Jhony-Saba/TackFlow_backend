const asyncHandler =require('express-async-handler')
const jwt =require('jsonwebtoken')
const validateToken = asyncHandler(async(req,res,next)=>{

let token;
let authHeader = req.header('Authorization');
if(authHeader && authHeader.startsWith('Bearer ')){

token=authHeader.split(" ")[1];
jwt.verify(token,process.env.ASSECC_TOKEN_SECRET,(err,decode)=>{
    
  if(err){
        res.status(401);
        throw new  Error("User is not authorised")
     } 
    //  console.log(decode);
    req.user = decode;
      next();

})}else {
    res.status(401);
    throw new Error("Authorization header missing or invalid");
  }
})
module.exports={validateToken};
