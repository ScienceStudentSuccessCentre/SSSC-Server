"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const global = module.exports;
var cheerio_1 = __importDefault(require("cheerio"));
var request_1 = __importDefault(require("request"));
var event_js_1 = __importDefault(require("./event.js"));
var baseURL = "http://sssc.carleton.ca";
var eventsURL = "/events";
var ssscdb = [];
function scrape() {
    console.log("Scraping...");
    request_1.default(baseURL + eventsURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            ssscdb = [];
            parse(body);
        }
        else {
            failedScrape(error, response, body);
        }
    });
}
exports.scrape = scrape;
function parse(body) {
    var events$ = cheerio_1.default.load(body, {
        normalizeWhitespace: true
    });
    events$('.event-listing--list-item').each(function (i, element) {
        var event;
        console.log("Processing event: " + i);
        var element$ = cheerio_1.default.load(element);
        var eventName = element$('.event-details--title').text();
        var eventUrl = element$('a').first().attr('href');
        var eventFullDate = element$('.event-details--date').text().split(" ");
        var eventYear = Number(eventFullDate[eventFullDate.length - 1].trim());
        var eventMonth = element$('.event-cal-ico--month').text().trim();
        var eventDay = Number(element$('.event-cal-ico--day').text().trim());
        event = new event_js_1.default(eventName, eventUrl, eventYear, eventMonth, eventDay);
        request_1.default(baseURL + event.url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var event$ = cheerio_1.default.load(body, {
                    normalizeWhitespace: true
                });
                event.description = event$('.event--description').text().trim();
                var eventDetails$ = cheerio_1.default.load(event$('.event--details').html(), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function (j, detail) {
                    var detail$ = cheerio_1.default.load(detail);
                    var eventDetail = detail$('.event-detail--content').text().trim();
                    if (detail$('.fa-clock-o').length > 0) {
                        event.time = eventDetail;
                    }
                    else if (detail$('.fa-reply').length > 0) {
                        //parse reply info
                    }
                    else if (detail$('.fa-map-marker').length > 0) {
                        event.location = eventDetail;
                    }
                });
                printEvent(event);
                ssscdb.push(event);
            }
            else {
                failedScrape(error, response, body);
            }
        });
    });
}
function printEvent(event) {
    console.log("Event: " + event.name);
    console.log("\tURL: " + event.url);
    console.log("\tDate: " + event.month + " " + event.day + ", " + event.year);
    console.log("\tDescription: " + event.description);
    console.log("\tTime: " + event.time);
    console.log("\tLocation: " + event.location);
    console.log("\tImageURL: " + event.imageUrl);
}
function failedScrape(error, response, body) {
    console.log("Failed to scrape.");
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}
function getEvents() {
    console.log("Retrieving events...");
    // ssscdb.push({"name": "name", "url": "url", "year": "0", "month": "month", "day": "0", "description": "description", "time": "time", "location": "location", "imageUrl": "imageUrl"});
    ssscdb.forEach(function (event) {
        printEvent(event);
    });
    return JSON.stringify(ssscdb);
}
exports.getEvents = getEvents;
