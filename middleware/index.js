// ALL MIDDLEWARE FOR APP
const Bookstore = require('../models/bookstore');
const Review = require('../models/review');
const middlewareObj = {};

//Check bookstore ownership middleware
middlewareObj.checkBookstoreOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Bookstore.findById(req.params.id, function(err, foundBookstore){
			if(err){
				req.flash('error', 'Bookstore not found.');
				res.redirect('back');
			} else {
				//Does user own the bookstore? (check if logged in user's id = id of person who created bookstore)
				if(foundBookstore.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that.')
					res.redirect('back');
				}
			}
		});
	//If not logged in:
	} else {
		req.flash('error', 'You must be logged in to do that.')
		//Take user back to previous page
		res.redirect('back');
	}
}

// Check review ownership middleware
middlewareObj.checkReviewOwnership = function(req, res, next){
	//Is user logged in?
	if(req.isAuthenticated()){
		Review.findById(req.params.review_id, function(err, foundReview){
			if(err){
				res.redirect('back');
			} else {
				//Does user own the review (compare author ID to ID of currently logged in user)? 
				if(foundReview.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that!');
					res.redirect('back');
				}
			}
		});
	//If not logged in:
	} else {
		req.flash('error', 'You must be logged in to do that!');
		//Take user back to previous page
		res.redirect('back');
	}
}

//isLoggedIn Middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must be logged in to do that.');
	res.redirect('/login');
}

// Export Middleware
module.exports = middlewareObj;