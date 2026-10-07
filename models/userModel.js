const mongoose = require('mongoose');

/**
* User Schema
*
* Represents an application user.
* Each user has a unique email address, a username,
* a password for authentication, and a role that
* determines their permissions within the system.
*
* Available Roles:
* - admin
* - user
*
* @typedef {Object} User
* @property {string} username - Unique username of the user.
* @property {string} password - User's hashed password.
* @property {string} email - Unique email address.
* @property {string} role - User role (admin or user).
*/
const userSchema = new mongoose.Schema({
  
  username: { type: String, required: [true,"Please add user name"] },
  password: { type: String, required: [true,"Please add your password"] },
  email: {type:String ,requires:[true,"Please add the user email address"] ,unique:true}, 
  role: { type: String, enum: ['admin', 'user'], required: [true,"Please add role of the user"] ,default:"user"}
}
);

module.exports = mongoose.model('User', userSchema);

