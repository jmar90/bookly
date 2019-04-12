//LOAD IN EXPRESS, EXPRESS ROUTER, & MODELS
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//Root page (landing page)
router.get('/', (req, res) => {
	res.render('landing');
});

// AUTH ROUTES //
//Show register form
router.get('/register', (req, res) => {
	res.render('register');
});

//Handle sign up logic
router.post('/register', (req, res) => {
	let newUser = new User({username: req.body.username}); //username from form
	User.register(newUser, req.body.password, function(err, user){  //store password as hash
		if(err){
			console.log(err);
			// Render register form again if error
			return res.render('register');
		} 
		// Login, authenticate, & redirect to /bookstores
		passport.authenticate('local')(req, res, function(){
			res.redirect('/bookstores');
		});
	}); 
});

//Show login form
router.get('/login', (req, res) => {
	res.render('login');
});

//Handle login logic: use passport.authenticate middleware to authenticate password/username info entered by user
router.post('/login', passport.authenticate('local', 
	{	successRedirect: '/bookstores',
		failureRedirect: '/login'
	}), (req, res) => {
});

//Logout route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/bookstores');
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
