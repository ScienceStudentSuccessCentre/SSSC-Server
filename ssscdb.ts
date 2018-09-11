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
        let eventName = element$('.event-details--title').text().trim();
        let eventUrl = element$('a').first().attr('href');
        var eventFullDate = element$('.event-details--date').text().split(" ");
        let eventYear = Number(eventFullDate[eventFullDate.length - 1].trim());
        let eventMonth = element$('.event-cal-ico--month').text().trim();
        let eventDay = Number(element$('.event-cal-ico--day').text().trim());
        let eventDescription = "";
        let eventTime = "";
        let eventLocation = "";
        let eventImageUrl = "";
        event = new Event(eventName, eventUrl, eventYear, eventMonth, eventDay);
        request(baseURL + eventUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let event$ = cheerio.load(body, {
                    normalizeWhitespace: true
                });
                const rawEventDescription$ = cheerio.load((event$('.event--description').html() as string), {
                    normalizeWhitespace: true
                });
                eventImageUrl = rawEventDescription$('img').attr('src');
                if (eventImageUrl) {
                    eventImageUrl = baseURL + eventImageUrl;
                }
                let eventDescriptionHtml = event$('.event--description').html();
                if (eventDescriptionHtml) {
                    eventDescription = cheerio.load(eventDescriptionHtml.split('<a').join('{%a').split('</a>').join('{%/a%}'), {
                        normalizeWhitespace: true
                    }).root().text().split('{%a').join('<a').split('{%/a%}').join('</a>').trim().split('\n').join('<br />');
                }
                const eventDetails$ = cheerio.load((event$('.event--details').html() as string), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function(i, detail) {
                    const detail$ = cheerio.load(detail);
                    var eventDetail = detail$('.event-detail--content').text().trim();
                    if (detail$('.fa-clock-o').length > 0) {
                        eventTime = eventDetail;
                    } else if (detail$('.fa-reply').length > 0) {
                        //parse reply info
                    } else if (detail$('.fa-map-marker').length > 0) {
                        eventLocation = eventDetail;
                    }
                });
                event.setDetails(eventDescription, eventTime, eventLocation, eventImageUrl);
                event.print();
                ssscdb.push(event);
            } else {
                failedScrape(error, response, body);
            }
        });
    });
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
        event.print();
    });
    return JSON.stringify(ssscdb);
}
