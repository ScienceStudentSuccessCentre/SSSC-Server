"use strict";
//Copyright 2017, Avery Vine, All rights reserved.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var request_1 = __importDefault(require("request"));
var ssscdb = __importStar(require("./ssscdb.js"));
var app = express_1.default();
var ROOT = "./public";
//receive a port, or select default port
app.set('port', (process.env.PORT || 5000));
//log each server request
app.use(function (req, res, next) {
    console.log(req.method + " request for " + req.url);
    next();
});
app.get('/events', function (req, res) {
    res.send(ssscdb.getEvents());
});
//render the home page
app.get(['/', '/index.html', '/index'], function (req, res) {
    res.sendFile('index.html', { root: ROOT });
});
//send all other static files
app.use(express_1.default.static(ROOT));
//send 404 for anything other request
app.all("*", function (req, res) {
    res.status(404);
    res.send(JSON.stringify({}));
});
//start listening on the selected port
app.listen(app.get('port'), function () {
    console.log('Server listening on port', app.get('port'));
    cycle();
    setInterval(function () {
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
    request_1.default('http://sssc-carleton-app-server.herokuapp.com', function (error, response, body) {
        console.log('Pinged to keep dyno awake');
    });
}
