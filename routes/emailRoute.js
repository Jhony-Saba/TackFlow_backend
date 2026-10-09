const express =require('express');
const email=require('../Controllers/emailController')
const router=express.Router();


router.route('/email').post(email.send_verification);




module.exports =router;