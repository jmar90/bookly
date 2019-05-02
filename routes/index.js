//LOAD IN EXPRESS, EXPRESS ROUTER, & MODELS
const express = require('express');
const router = express.Router();

const 	passport 	= require('passport'),
		User 		= require('../models/user'),
		Bookstore 	= require('../models/bookstore'),
		Review 		= require('../models/review'),
		middleware 	= require('../middleware');

//ROOT PAGE (landing page)
router.get('/', (req, res) => {
	res.render('landing');
});

// AUTH ROUTES //
//Show register form
router.get('/register', middleware.allowSignUp, (req, res) => {
	res.render('register');
});

//Handle sign up logic
router.post('/register', middleware.allowSignUp, (req, res) => {
	let newUser = new User(
		{ 
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			username: req.body.username, 
			avatar: req.body.avatar,
			bio: req.body.bio
		}); 
	User.register(newUser, req.body.password, (err, user) => {  //store password as hash
		if(err){
			// If error, flash error (eg, username already taken)
			req.flash('error', err.message);
			// Render register form again if error
			return res.redirect('/register');
		} 
		// Login, authenticate, & redirect to /bookstores
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to bookly, ' + user.username + '!')
			res.redirect('/bookstores');
		});
	}); 
});

//Show login form
router.get('/login', middleware.allowLogIn, (req, res) => {
	res.render('login');
});

//Handle login logic: use passport.authenticate middleware to authenticate password/username info entered by user
router.post('/login', middleware.allowLogIn, passport.authenticate('local', 
	{	successRedirect: '/bookstores',
		failureRedirect: '/login'
	}), (req, res) => {
});

//Logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You have been logged out!');
	res.redirect('/bookstores');
});

//User's profile 
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err || !foundUser){
			req.flash('error', 'User not found.');
			return res.redirect('/bookstores');
		}
		Bookstore.find().where('author.id').equals(foundUser._id).exec((err, bookstores) => {
			if(err){
				req.flash('error', 'Oops! Something went wrong at our end.');
				return res.redirect('/bookstores');
			}
		    Review.find().where('author.id').equals(foundUser._id).populate('bookstore').exec((err, reviews) => {
	            if(err) {
	                req.flash('error', 'Oops! Something went wrong at our end.');
	                return res.redirect('/bookstores');
	            }
            	res.render('users/show', {user: foundUser, bookstores: bookstores, reviews: reviews});    
	        });
		});
	});
});

// EXPORT EXPRESS ROUTER
module.exports = router;
