const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Define collection and schema
let user = new Schema({
    email: {type:String},
    userName:{type:String},
    password:{type:String}
 });

 user.statics.hashPassword = function hashPassword(password){
     return bcrypt.hashSync(password,10);
 }

 user.methods.isValid = function(hashedpassword){
     return bcrypt.compareSync(hashedpassword,this.password);
 }

 module.exports = mongoose.model('User',user);
