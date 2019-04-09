// (Note: For db to work, start up MongoDB via 'mongod' in separte terminal)

// ===================================================================
// LOAD IN MODULES
// ===================================================================
const express 		= require('express'),
		app 			= express(),
		bodyParser 	= require('body-parser'),
		mongoose		= require('mongoose'),
		Bookstore 	= require('./models/bookstore'),
		Review 		= require('./models/review');


// ===================================================================
// APP CONFIGURATION: Connect to bookly DB & tell app to use packages
// ===================================================================
mongoose.connect('mongodb://localhost:27017/bookly', { useNewUrlParser: true});  //27017 is default port for mongo

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// SEED DATA:
// Bookstore.create(
// 	{
// 		name: 'Dusty Bookshelf',
// 		image: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
// 		description: 'A quaint, cozy bookshop.'
// 	}, function(err, bookstore){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log('New bookstore');
// 			Review.create(
// 		      {
// 		         text: "My favorite local bookstore!",
// 		         author: "Julia"
// 		      }, function(err, review){
// 		         	if(err){
// 		               console.log(err);
// 		          	} else {
// 		               bookstore.reviews.push(review);
// 		               bookstore.save(); //Save campground
// 		               console.log("Created new review");
// 		           }
// 		      });
// 		}
// 	})


// ===================================================================
// SET UP ROUTES 
// ===================================================================

// BOOKSTORE ROUTES //

//Root page (landing page)
app.get('/', (req, res) => {
	res.render('landing');
});

//INDEX - view all bookstores
app.get('/bookstores', (req, res) => {
	// Pull all bookstore data from Bookstores collection, which is saved in Bookstore const
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
app.get('/bookstores/new', (req, res) => {
	res.render('bookstores/new');
})

//CREATE - add new bookstore to DB
app.post('/bookstores', (req, res) => {
	//Get data from form & add to bookstores array
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newBookstore = {name: name, image: image, description: desc};
	//Create a new bookstore & save to DB
	Bookstore.create(newBookstore, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//If new bookstore successfully added, redirect (via get request) back to bookstores route
			res.redirect('/bookstores');
		}
	})	
});

// SHOW - shows more info about one bookstore
app.get('/bookstores/:id', (req, res) => {
	//Find bookstore for provided ID (ie, what bookstore has the id entered in '/bookstores/id' url)
	//Then, populate reviews for that bookstore (.exec is what runs the query)
	Bookstore.findById(req.params.id).populate('reviews').exec(function(err, foundBookstore){
		if(err){
			console.log(err);
		} else{
			//Render show template for that bookstore. Pass thru data for foundBookstore under name 'bookstore.'
			res.render('bookstores/show', {bookstore: foundBookstore});
		}
	});
})


// REVIEW ROUTES //

// NEW - show form for adding new review
app.get('/bookstores/:id/reviews/new', (req, res) => {
	//Find the bookstore tied to review by id
	Bookstore.findById(req.params.id, function(err, bookstore){
		if(err){
			console.log(err);
		} else {
			res.render('reviews/new', {bookstore: bookstore}); //pass thru relevant bookstore data
		}
	})
});

// CREATE - post new review
app.post('/bookstores/:id/reviews', (req, res) => {
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


// ===================================================================
// SET UP PORT 
// ===================================================================
// Note: view app by starting app (nodemon app.js) & then typing 'localhost:3000' in browser
app.listen(process.env.PORT || 3000, () => {
	console.log('Bookly server is running!');
});

