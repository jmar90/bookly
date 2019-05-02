// LOAD IN MONGOOSE
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// SCHEMA SET UP (ie, define data structure)
const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
	firstName: String,
	lastName: String,
	email: String,
	bio: String
});

userSchema.plugin(passportLocalMongoose);

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('User', userSchema);