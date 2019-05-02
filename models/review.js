// LOAD IN MONGOOSE
const mongoose = require('mongoose');

// SCHEMA SET UP
const reviewSchema = new mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'  //name of model we are referencing
		},
		username: String
	},
	bookstore: { // save bookstore id
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bookstore'  
	}
});

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('Review', reviewSchema);