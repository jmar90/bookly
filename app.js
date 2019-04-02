// LOAD IN MODULES //
const express 		= require('express'),
		bodyParser 	= require('body-parser'),
		app 			= express();


// APP CONFIGURATION: Tell app to use packages //
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// SEED DATA //
let bookstores = [
	{
		name: 'The Dusty Bookshelf',
		image: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
	},
	{
		name: 'Bibliophile',
		image: 'https://images.unsplash.com/photo-1526248283201-fafd30eb2b90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
	},
	{
		name: 'Book Pressing',
		image: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
	},
	{
		name: 'Worn Pages',
		image: 'https://images.unsplash.com/photo-1519498955853-621f66b86038?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80'
	},
	{
		name: 'Bookmark',
		image: 'https://images.unsplash.com/photo-1548844707-68d851b62ebc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
	},
	{
		name: 'Pages',
		image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80'
	},
	{
		name: 'Book Nook',
		image: 'https://images.unsplash.com/photo-1525358180237-7399f908a1d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1057&q=80'
	},
	{
		name: 'A Quiet Corner',
		image: 'https://images.unsplash.com/photo-1530519362533-b36020711133?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
	}
]


// SET UP ROUTES //
//Root page (landing page)
app.get('/', (req, res) => {
	res.render('landing');
});

//View all bookstores (get)
app.get('/bookstores', (req, res) => {
	//Render bookstores.ejs file. {name we want to give: data we are passing thru}
	res.render('bookstores', {bookstores:bookstores});
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
	bookstores.push(newBookstore);
	//Redirect (via get request) back to bookstores route
	res.redirect('/bookstores');
});

// SET UP PORT //
// Note: view app by starting app (nodemon app.js) & then typing 'localhost:3000' in browser
app.listen(process.env.PORT || 3000, () => {
	console.log('Bookly server is running!');
});

