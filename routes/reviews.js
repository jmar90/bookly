//LOAD IN EXPRESS, EXPRESS ROUTER, & MODELS
const express = require('express');
const router = express.Router({mergeParams: true});
const Bookstore = require('../models/bookstore');
const Review = require('../models/review');
const middleware = require('../middleware');

// REVIEW NEW - show form for adding new review
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
					req.flash('error', 'Something went wrong!');
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
					req.flash('success', 'Your review has been added!');
					res.redirect('/bookstores/' + bookstore._id); //redirect back to store's show page
				}
			})
		}
	});
});

// REVIEW EDIT - show form to edit comment
router.get('/:review_id/edit', middleware.checkReviewOwnership, (req, res) => {
	Review.findById(req.params.review_id, function(err, foundReview){
		if(err){
			res.redirect('back');
		} else {
			res.render('reviews/edit', {bookstore_id: req.params.id, review: foundReview});
		}
	})
});

// REVIEW UPDATE - update review
router.put('/:review_id', middleware.checkReviewOwnership, (req, res) => {
	Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview){
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Review successfully updated!');
			// Redirect back to show page
			res.redirect('/bookstores/' + req.params.id);
		}
	});
});

// REVIEW DESTROY - delete comment
router.delete('/:review_id', middleware.checkReviewOwnership, (req, res) => {
	// Find by ID and remove
	Review.findByIdAndRemove(req.params.review_id, function(err){
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Your review has been deleted.');
			res.redirect('/bookstores/' + req.params.id);
		}
	})
});

// EXPORT EXPRESS ROUTER
module.exports = router;
