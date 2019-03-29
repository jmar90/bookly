// LOAD IN MODULES //
const express 	= require('express'),
		app 		= express();


// APP CONFIGURATION //
//Set ejs as view engine
app.set('view engine', 'ejs');


// SET UP ROUTES //
//Root route (landing page)
app.get('/', (req, res) => {
	res.render('landing');
});

//Bookstore route
app.get('/bookstores', (req, res) => {
	//Seed data
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
			name: 'Bookstore around the Corner',
			image: 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
		}
	]

	//Render bookstores.ejs file. {name we want to give: data we are passing thru}
	res.render('bookstores', {bookstores:bookstores});
});


// SET UP PORT //
// Note: view app by starting app (nodemon app.js) & then typing 'localhost:3000' in browser
app.listen(process.env.PORT || 3000, () => {
	console.log('Bookly server is running!');
});

