//LOAD IN EXPRESS, EXPRESS ROUTER, & MODELS
const express = require('express');
const router = express.Router();
const Bookstore = require('../models/bookstore');
const Review = require('../models/review');
const middleware = require('../middleware');

//INDEX - view all bookstores
router.get('/', (req, res) => {	// Pull all bookstore data from Bookstores collection, which is saved in Bookstore const
	Bookstore.find({}, function(err, allBookstores){
		if(err){
			console.log(err);
		} else {
			//Render index.ejs file. {name we want to give: data we are passing thru}
			//Pass thru the allBookstores data from our Mongo DB to index.js under the name 'bookstores'
			res.render('bookstores/index', {bookstores:allBookstores}); 
		}
	})
});

//NEW - show form to create new bookstore 
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('bookstores/new');
})

//CREATE - add new bookstore to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
	//Get data from form & add to bookstores array
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newBookstore = {name: name, image: image, description: desc, author: author};
	//Create a new bookstore & save to DB
	Bookstore.create(newBookstore, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			req.flash('success', 'Success! Bookstore added.');
			//If new bookstore successfully added, redirect (via get request) back to bookstores route
			res.redirect('/bookstores');
		}
	})	
});

// SHOW - shows more info about one bookstore
router.get('/:id', (req, res) => {
	//Find bookstore for provided ID (ie, what bookstore has the id entered in '/bookstores/id' url)
	//Then, populate reviews for that bookstore (.exec is what runs the query)
	Bookstore.findById(req.params.id).populate('reviews').exec(function(err, foundBookstore){
		//If error or null bookstore
		if(err || !foundBookstore){
			req.flash('error', 'Bookstore not found.');
			res.redirect('/bookstores');
		} else{
			//Render show template for that bookstore. Pass thru data for foundBookstore under name 'bookstore.'
			res.render('bookstores/show', {bookstore: foundBookstore});
		}
	});
})

// EDIT BOOKSTORE (form to edit)
router.get('/:id/edit', middleware.checkBookstoreOwnership, (req, res) => {
	Bookstore.findById(req.params.id, function(err, foundBookstore){
		res.render('bookstores/edit', {bookstore: foundBookstore});	
	});
});

// UPDATE BOOKSTORE
router.put('/:id', middleware.checkBookstoreOwnership, (req, res) => {
	// Find and update the correct bookstore
	Bookstore.findByIdAndUpdate(req.params.id, req.body.bookstore, function(err, updatedBookstore){
		if(err){
			res.redirect('/bookstores');
		} else {
			req.flash('success', 'Update successful!');
			// Redirect back to show page
			res.redirect('/bookstores/' + req.params.id);
		}
	});
})

// DESTROY BOOKSTORE AND ITS ASSOCIATED REVIEWS
router.delete('/:id', middleware.checkBookstoreOwnership, (req, res) => {
    Bookstore.findByIdAndRemove(req.params.id, (err, bookstoreRemoved) => {
        if (err) {
            res.redirect('/bookstores');
        }
        Review.deleteMany( {_id: { $in: bookstoreRemoved.reviews } }, (err) => {
            if (err) {
                console.log(err);
                res.redirect('/bookstores');
            }
            req.flash('success', 'Bookstore deleted');
            res.redirect('/bookstores');
        });
    })
});

// EXPORT EXPRESS ROUTER
module.exports = router;
