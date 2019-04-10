// LOAD IN MODULES
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// SCHEMA SET UP (ie, define data structure)
const userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('User', userSchema);