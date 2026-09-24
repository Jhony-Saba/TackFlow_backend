const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  
  username: { type: String, required: [true,"Please add user name"] },
  password: { type: String, required: [true,"Please add your password"] },
  email: {type:String ,requires:[true,"Please add the user email address"] ,unique:true}, 
  role: { type: String, enum: ['admin', 'user'], required: [true,"Please add role of the user"] ,default:"user"}
}
);

module.exports = mongoose.model('User', userSchema);



