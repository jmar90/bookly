//LOAD IN EXPRESS, EXPRESS ROUTER, & MODELS
const express = require('express');
const router = express.Router({mergeParams: true});
const Bookstore = require('../models/bookstore');
const Review = require('../models/review');

// REVIEW NEW - show form for adding new review
router.get('/new', isLoggedIn, (req, res) => {
	//Find the bookstore tied to review by id
	Bookstore.findById(req.params.id, function(err, bookstore){
		if(err){
			console.log(err);
		} else {
			res.render('reviews/new', {bookstore: bookstore}); //pass thru relevant bookstore data
		}
	})
});

// REVIEW CREATE - post new review
router.post('/', isLoggedIn, (req, res) => {
	//Look up bookstore using ID
	Bookstore.findById(req.params.id, function(err, bookstore){
		// If no matching bookstore found, error
		if(err){
			console.log(err);
			res.redirect('/bookstores');
		} else {
			// Otherwise, create new review (remember: we named author/text fields in form review[author] & review[text],
			// so we can access both pieces of data via req.body.review)
			Review.create(req.body.review, function(err, review){
				if(err){
					console.log(err);
				} else {
					// Add username & id to review
					review.author.id = req.user._id;
					review.author.username = req.user.username;
					// Save review
					review.save();
					// Add new review to DB & connect to the respective bookstore
					// Remember: our model is called Review, BUT the data collection/table is called 'reviews'
					// 'bookstore' refers to the bookstore we found via Bookstore.findById
					bookstore.reviews.push(review);
					bookstore.save();
					res.redirect('/bookstores/' + bookstore._id); //redirect back to store's show page
				}
			})
		}
	});
});

//isLoggedIn Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

// EXPORT EXPRESS ROUTER
module.exports = router;
