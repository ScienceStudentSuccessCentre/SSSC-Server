//Copyright 2017, Avery Vine, All rights reserved.

import express from 'express';
import request from 'request';
import * as ssscdb from './ssscdb.js';

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
	res.send(ssscdb.getEvents());
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
	cycle();
	setInterval(() => {
		cycle();
	}, 1500000);
});

//run one scrape cycle on the SSSC website, then ping Heroku
function cycle() {
	ssscdb.scrape();
	ping();
}

//gets around the Heroku (hosting service) limit of 30 minutes of inactivity
function ping() {
	request('http://sssc-carleton-app-server.herokuapp.com', function (error, response, body) {
		console.log('Pinged to keep dyno awake');
	});
}