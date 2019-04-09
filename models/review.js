// LOAD IN MODULES
const mongoose = require('mongoose');

// SCHEMA SET UP
const reviewSchema = new mongoose.Schema({
	text: String,
	author: String
});

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('Review', reviewSchema);