// const global = module.exports;
import cheerio from 'cheerio';
import request from 'request';
import Event from './event.js';

const baseURL = "http://sssc.carleton.ca";
const eventsURL = "/events";
var ssscdb: Event[] = [];

export function scrape() {
    console.log("Scraping...");
    request(baseURL + eventsURL, function (error: string, response: request.Response, body: string) {
        if (!error && response.statusCode == 200) {
            ssscdb = [];
            parse(body);
        } else {
            failedScrape(error, response, body);
        }
	});
}

function parse(body: string) {
    const events$ = cheerio.load(body, {
        normalizeWhitespace: true
    });
    events$('.event-listing--list-item').each(function(i, element) {
        var event: Event;
        console.log("Processing event: " + i);
        let element$ = cheerio.load(element);
        let eventName = element$('.event-details--title').text();
        let eventUrl = element$('a').first().attr('href');
        var eventFullDate = element$('.event-details--date').text().split(" ");
        let eventYear = Number(eventFullDate[eventFullDate.length - 1].trim());
        let eventMonth = element$('.event-cal-ico--month').text().trim();
        let eventDay = Number(element$('.event-cal-ico--day').text().trim());
        event = new Event(eventName, eventUrl, eventYear, eventMonth, eventDay);
        request(baseURL + event.url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let event$ = cheerio.load(body, {
                    normalizeWhitespace: true
                });
                event.description = event$('.event--description').text().trim();
                const eventDetails$ = cheerio.load((event$('.event--details').html() as string), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function(j, detail) {
                    const detail$ = cheerio.load(detail);
                    var eventDetail = detail$('.event-detail--content').text().trim();
                    if (detail$('.fa-clock-o').length > 0) {
                        event.time = eventDetail;
                    } else if (detail$('.fa-reply').length > 0) {
                        //parse reply info
                    } else if (detail$('.fa-map-marker').length > 0) {
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

function printEvent(event: Event) {
    console.log("Event: " + event.name);
    console.log("\tURL: " + event.url);
    console.log("\tDate: " + event.month + " " + event.day + ", " + event.year);
    console.log("\tDescription: " + event.description);
    console.log("\tTime: " + event.time);
    console.log("\tLocation: " + event.location);
    console.log("\tImageURL: " + event.imageUrl);
}

function failedScrape(error: string, response: request.Response, body: string) {
    console.log("Failed to scrape.");
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}

export function getEvents() {
    console.log("Retrieving events...");
    // ssscdb.push({"name": "name", "url": "url", "year": "0", "month": "month", "day": "0", "description": "description", "time": "time", "location": "location", "imageUrl": "imageUrl"});
    ssscdb.forEach(function(event) {
        printEvent(event);
    });
    return JSON.stringify(ssscdb);
}