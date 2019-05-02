// LOAD IN REQUIRED MODULES AND CREATE EMPTY MIDDLEWARE OBJECT
const 	Bookstore 	= require('../models/bookstore'),
		Review 		= require('../models/review');
const middlewareObj = {};

// CHECK BOOKSTORE OWNERSHIP
middlewareObj.checkBookstoreOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Bookstore.findById(req.params.id, (err, foundBookstore) =>{
			//If error or bookstore is null
			if(err || !foundBookstore){
				req.flash('error', 'Bookstore not found.');
				res.redirect('/bookstores');
			} else {
				//Does user own the bookstore? (check if logged in user's id = id of person who created bookstore)
				if(foundBookstore.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that.')
					res.redirect('/bookstores/' + req.params.id);
				}
			}
		});
	//If not logged in:
	} else {
		req.flash('error', 'You must be logged in to do that.')
		//Take user back to previous page
		res.redirect('/login');
	}
}

// CHECK REVIEW OWNERSHIP
middlewareObj.checkReviewOwnership = (req, res, next) => {
	//Is user logged in?
	if(req.isAuthenticated()){
		Review.findById(req.params.review_id, (err, foundReview) => {
			if(err || !foundReview){
				req.flash('error', 'Review not found.');
				res.redirect('/bookstores');
			} else {
				//Does user own the review (compare author ID to ID of currently logged in user)? 
				if(foundReview.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that!');
					res.redirect('/bookstores/' + req.params.id);
				}
			}
		});
	//If not logged in:
	} else {
		req.flash('error', 'You must be logged in to do that!');
		//Take user back to previous page
		res.redirect('/login');
	}
}

// CHECK IF USER IS LOGGED IN
middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must be logged in to do that.');
	res.redirect('/login');
}

// CHECK IF USER CAN REGISTER (if user already logged in, don't allow them to register again)
middlewareObj.allowSignUp = (req, res, next) => {
	if(req.isAuthenticated()){
		req.flash('error', 'You are already logged in; you can\'t register again.');
		return res.redirect('/bookstores');
	}
	return next();
}

// CHECK IF USER CAN LOG IN (if user is already logged in, don't allow them to log in again)
middlewareObj.allowLogIn = (req, res, next) => {
	if(req.isAuthenticated()){
		req.flash('error', 'You are already logged in.');
		return res.redirect('/bookstores');
	}
	return next();
}

// EXPORT MIDDLEWARE
module.exports = middlewareObj;
