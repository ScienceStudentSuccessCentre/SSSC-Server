//Copyright 2017, Avery Vine, All rights reserved.

var express = require('express');
var app = express();

const ROOT = "./public";

//receive a port, or select default port
app.set('port', (process.env.PORT || 5000));

//log each server request
app.use(function(req, res, next) {
	console.log(req.method + " request for " + req.url);
	next();
});

app.get('/events', function(req, res) {

});

//render the home page
app.get(['/', '/index.html', '/index'], function(req, res) {
	res.sendFile('index.html', { root: ROOT });
});

//send all other static files
app.use(express.static(ROOT));

//send 404 for anything other request
app.all("*", function(req, res) {
    res.status(404);
	res.send(JSON.stringify({}));
})

//start listening on the selected port
app.listen(app.get('port'), function () {
	console.log('Server listening on port', app.get('port'));
	ping();
	setInterval(() => {
		ping();
	}, 1500000);
});

//gets around the Heroku (hosting service) limit of 30 minutes of inactivity
function ping() {
	request('http://ssscdb.herokuapp.com', function (error, response, body) {
		console.log('Pinged to keep dyno awake');
	});
}