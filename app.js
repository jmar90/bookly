// (Note: For db to work, start up MongoDB via 'mongod' in separte terminal)

// LOAD IN MODULES //
const express 		= require('express'),
		app 			= express(),
		bodyParser 	= require('body-parser'),
		mongoose		= require('mongoose');


// APP CONFIGURATION: Connect to bookly DB & tell app to use packages //
mongoose.connect('mongodb://localhost:27017/bookly', { useNewUrlParser: true});  //27017 is default port for mongo

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// SCHEMA SET UP (ie, define data structure)
const bookstoreSchema = new mongoose.Schema({
	name: String,
	image: String
});

// CREATE COLLECTIONS (ie, data tables)
// Do this by compiling schema into a model
const Bookstore = mongoose.model('Bookstore', bookstoreSchema);

// Bookstore.create(
// 	{
// 		name: 'Bibliophile',
// 		image: 'https://images.unsplash.com/photo-1526248283201-fafd30eb2b90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
// 	}, function(err, bookstore){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log('New bookstore');
// 			console.log(bookstore);
// 		}
// 	})


// SET UP ROUTES //
//Root page (landing page)
app.get('/', (req, res) => {
	res.render('landing');
});

//View all bookstores (get)
app.get('/bookstores', (req, res) => {
	// Pull all bookstore data from Bookstores collection, which is saved in Bookstore const
	Bookstore.find({}, function(err, allBookstores){
		if(err){
			console.log(err);
		} else {
			//Render bookstores.ejs file. {name we want to give: data we are passing thru}
			//Pass thru the allBookstores data from our Mongo DB to bookstores.js under the name 'bookstores'
			res.render('bookstores', {bookstores:allBookstores}); 
		}
	})
});

//Form to add a bookstore (get)
app.get('/bookstores/new', (req, res) => {
	res.render('new');
})

//Add bookstore (post)
app.post('/bookstores', (req, res) => {
	//Get data from form & add to bookstores array
	let name = req.body.name;
	let image = req.body.image;
	let newBookstore = {name: name, image: image};
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

// SET UP PORT //
// Note: view app by starting app (nodemon app.js) & then typing 'localhost:3000' in browser
app.listen(process.env.PORT || 3000, () => {
	console.log('Bookly server is running!');
});

