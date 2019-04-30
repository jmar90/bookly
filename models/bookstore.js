// LOAD IN MODULES
const mongoose = require('mongoose');

// SCHEMA SET UP (ie, define data structure)
const bookstoreSchema = new mongoose.Schema({
	name: String,
	address: String,
	image: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	reviews: [  //not embedding actual reviews; rather, embedding array of review IDs
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('Bookstore', bookstoreSchema);