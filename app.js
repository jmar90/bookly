// (Note: For db to work, start up MongoDB via 'mongod' in separte terminal)

// ===================================================================
// LOAD IN MODULES & ROUTES
// ===================================================================
const express 				= require('express'),
		app 					= express(),
		bodyParser 			= require('body-parser'),
		mongoose				= require('mongoose'),
		passport				= require('passport'),
		LocalStrategy		= require('passport-local'),
		methodOverride		= require('method-override'),
		Bookstore 			= require('./models/bookstore'),
		Review 				= require('./models/review'),
		User 					= require('./models/user');

const reviewRoutes 		= require('./routes/reviews'),
		bookstoreRoutes 	= require('./routes/bookstores'),
		indexRoutes			= require('./routes/index');

// ===================================================================
// APP CONFIGURATION: Connect to bookly DB & tell app to use packages
// ===================================================================
mongoose.connect('mongodb://localhost:27017/bookly', { useNewUrlParser: true});  //27017 is default port for mongo
mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

// PASSPORT CONFIGURATION //
app.use(require('express-session')({  //Enable sessions
	secret: '', //Enter random string
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Create middleware that will run on all routes to pass thru data re: whether or not a user is logged in
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// ROUTE CONFIGURATION //
app.use('/', indexRoutes);
app.use('/bookstores', bookstoreRoutes);  //to all bookstore routes append '/bookstores' to beginning
app.use('/bookstores/:id/reviews', reviewRoutes);

// ===================================================================
// SET UP PORT 
// ===================================================================
// Note: view app by starting app (nodemon app.js) & then typing 'localhost:3000' in browser
app.listen(process.env.PORT || 3000, () => {
	console.log('Bookly server is running!');
});

