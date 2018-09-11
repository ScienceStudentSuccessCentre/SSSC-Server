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
        var eventName = element$('.event-details--title').text().trim();
        var eventUrl = element$('a').first().attr('href');
        var eventFullDate = element$('.event-details--date').text().split(" ");
        var eventYear = Number(eventFullDate[eventFullDate.length - 1].trim());
        var eventMonth = element$('.event-cal-ico--month').text().trim();
        var eventDay = Number(element$('.event-cal-ico--day').text().trim());
        var eventDescription = "";
        var eventTime = "";
        var eventLocation = "";
        var eventImageUrl = "";
        event = new event_js_1.default(eventName, eventUrl, eventYear, eventMonth, eventDay);
        request_1.default(baseURL + eventUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var event$ = cheerio_1.default.load(body, {
                    normalizeWhitespace: true
                });
                var rawEventDescription$ = cheerio_1.default.load(event$('.event--description').html(), {
                    normalizeWhitespace: true
                });
                eventImageUrl = rawEventDescription$('img').attr('src');
                if (eventImageUrl) {
                    eventImageUrl = baseURL + eventImageUrl;
                }
                var eventDescriptionHtml = event$('.event--description').html();
                if (eventDescriptionHtml) {
                    eventDescription = cheerio_1.default.load(eventDescriptionHtml.split('<a').join('{%a').split('</a>').join('{%/a%}'), {
                        normalizeWhitespace: true
                    }).root().text().split('{%a').join('<a').split('{%/a%}').join('</a>').trim().split('\n').join('<br />');
                }
                var eventDetails$ = cheerio_1.default.load(event$('.event--details').html(), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function (i, detail) {
                    var detail$ = cheerio_1.default.load(detail);
                    var eventDetail = detail$('.event-detail--content').text().trim();
                    if (detail$('.fa-clock-o').length > 0) {
                        eventTime = eventDetail;
                    }
                    else if (detail$('.fa-reply').length > 0) {
                        //parse reply info
                    }
                    else if (detail$('.fa-map-marker').length > 0) {
                        eventLocation = eventDetail;
                    }
                });
                event.setDetails(eventDescription, eventTime, eventLocation, eventImageUrl);
                event.print();
                ssscdb.push(event);
            }
            else {
                failedScrape(error, response, body);
            }
        });
    });
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
        event.print();
    });
    return JSON.stringify(ssscdb);
}
exports.getEvents = getEvents;
