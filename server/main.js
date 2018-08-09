const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const server = require('http').Server(app);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// include routes
const routes = require('./router.js');
app.use('/', routes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

const port = process.env.PORT || 3007;

server.listen(port, () => {
	console.clear();
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
