// LOAD IN MODULES
const mongoose = require('mongoose');
const Review = require('./review');

// SCHEMA SET UP (ie, define data structure)
const bookstoreSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
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

// Add a prehook to delete associated reviews
bookstoreSchema.pre('remove', async function(next){
	try {
		await Review.remove({
			'_id': {
				$in: this.reviews
			}
		});
	} catch(err){
		next(err);
	}
});

// COMPILE SCHEMA INTO MODEL & EXPORT
module.exports = mongoose.model('Bookstore', bookstoreSchema);