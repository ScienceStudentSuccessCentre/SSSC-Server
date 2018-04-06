const global = module.exports;
const cheerio = require('cheerio');
const request = require('request');
const Event = require('./event.js');

const baseURL = "http://sssc.carleton.ca";
const eventsURL = "/events";
var ssscdb = [];

global.scrape = function() {
    console.log("Scraping...");
    request(baseURL + eventsURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            ssscdb = [];
            parse(body);
        } else {
            failedScrape(error, response, body);
        }
	});
}

parse = function(body) {
    const events$ = cheerio.load(body, {
        normalizeWhitespace: true
    });
    events$('.event-listing--list-item').each(function(i, element) {
        var event = {};
        console.log("Processing event: " + i);
        const element$ = cheerio.load(element);
        event.name = element$('.event-details--title').text();
        event.url = element$('a').first().attr('href');
        eventFullDate = element$('.event-details--date').text().split(" ");
        event.year = eventFullDate[eventFullDate.length - 1].trim();
        event.month = element$('.event-cal-ico--month').text().trim();
        event.day = element$('.event-cal-ico--day').text().trim();
        request(baseURL + event.url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const event$ = cheerio.load(body, {
                    normalizeWhitespace: true
                });
                event.description = event$('.event--description').text().trim();
                const eventDetails$ = cheerio.load(event$('.event--details').html(), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function(j, detail) {
                    const detail$ = cheerio.load(detail);
                    var eventDetail = detail$('.event-detail--content').text().trim();
                    if (detail$('.fa-clock-o') != "") {
                        event.time = eventDetail;
                    } else if (detail$('.fa-reply') != "") {
                        //parse reply info
                    } else if (detail$('.fa-map-marker') != "") {
                        event.location = eventDetail;
                    }
                });
                printEvent(event);
                ssscdb.push(event);
            } else {
                failedScrape(error, response, body);
            }
        });
    });
}

printEvent = function(event) {
    console.log("Event: " + event.name);
    console.log("\tURL: " + event.url);
    console.log("\tDate: " + event.month + " " + event.day + ", " + event.year);
    console.log("\tDescription: " + event.description);
    console.log("\tTime: " + event.time);
    console.log("\tLocation: " + event.location);
    console.log("\tImageURL: " + event.imageUrl);
}

failedScrape = function(error, response, body) {
    console.log("Failed to scrape.");
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}

global.getEvents = function() {
    console.log("Retrieving events...");
    // ssscdb.push({"name": "name", "url": "url", "year": "0", "month": "month", "day": "0", "description": "description", "time": "time", "location": "location", "imageUrl": "imageUrl"});
    return JSON.stringify(ssscdb);
}