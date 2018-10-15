"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        var eventDescription = "";
        var eventDate = new Date();
        var eventTime = "";
        var eventLocation = "";
        var eventImageUrl = "";
        var eventActionUrl = "";
        event = new event_js_1.default(eventName, eventUrl);
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
                    eventDescription = convertToHtmlText(eventDescriptionHtml);
                }
                var eventDetails$ = cheerio_1.default.load(event$('.event--details').html(), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function (i, detail) {
                    var detail$ = cheerio_1.default.load(detail);
                    var eventDetailRaw = detail$('.event-detail--content');
                    var eventDetail = eventDetailRaw.text().trim();
                    var eventDetailHtml = eventDetailRaw.html();
                    if (detail$('.fa-clock-o').length > 0) {
                        eventTime = detail$('.event-detail--content').text().trim();
                    }
                    else if (detail$('.fa-reply').length > 0) {
                        if (eventDetailHtml) {
                            eventActionUrl = detail$('a').first().attr('href');
                            // eventActionUrl = convertToHtmlText(eventDetailHtml);
                        }
                    }
                    else if (detail$('.fa-map-marker').length > 0) {
                        eventLocation = eventDetail;
                    }
                    else if (detail$('.fa-calendar').length > 0) {
                        eventDate = new Date(Date.parse(eventDetailRaw.find('time').attr('datetime')));
                    }
                });
                event.setDetails(eventDescription, eventDate, eventTime, eventLocation, eventImageUrl, eventActionUrl);
                event.print();
                ssscdb.push(event);
            }
            else {
                failedScrape(error, response, body);
            }
        });
    });
}
function convertToHtmlText(html) {
    var whitelist = ['a', 'ul', 'ol', 'li'];
    var normalizeListElementsRegexReplace1 = /<li>\s*<p>\s*/gi;
    var normalizeListElementsRegexReplacement1 = '<li>';
    var normalizeListElementsRegexReplace2 = /\s*<\/p>\s*<\/li>/gi;
    var normalizeListElementsRegexReplacement2 = '</li>';
    var normalizeListElementsRegexReplace3 = /<br \/>\s*<li>/gi;
    var normalizeListElementsRegexReplacement3 = '<li>';
    var normalizeListElementsRegexReplace4 = /<br \/><\/ul>/gi;
    var normalizeListElementsRegexReplacement4 = '</ul><br />';
    var normalizeListElementsRegexReplace5 = /<br \/><ul>/gi;
    var normalizeListElementsRegexReplacement5 = '<ul>';
    if (html != null) {
        html = html.replace(normalizeListElementsRegexReplace1, normalizeListElementsRegexReplacement1);
        html = html.replace(normalizeListElementsRegexReplace2, normalizeListElementsRegexReplacement2);
    }
    whitelist.forEach(function (element) {
        if (html != null) {
            html = cheerio_1.default.load(html.split('<' + element + '>')
                .join('{%' + element + '%}')
                .split('<' + element)
                .join('{%' + element)
                .split('</' + element + '>')
                .join('{%/' + element + '%}'), {
                normalizeWhitespace: true
            }).root().html();
        }
    });
    if (html != null) {
        html = cheerio_1.default.load(html, {
            normalizeWhitespace: true
        }).root().text();
    }
    whitelist.forEach(function (element) {
        if (html != null) {
            html = html.split('{%' + element + '%}')
                .join('<' + element + '>')
                .split('{%' + element)
                .join('<' + element)
                .split('{%/' + element + '%}')
                .join('</' + element + '>');
        }
    });
    if (html != null) {
        return html.trim()
            .split('\n')
            .join('<br />')
            .replace(normalizeListElementsRegexReplace3, normalizeListElementsRegexReplacement3)
            .replace(normalizeListElementsRegexReplace4, normalizeListElementsRegexReplacement4)
            .replace(normalizeListElementsRegexReplace5, normalizeListElementsRegexReplacement5)
            .toString();
    }
    return "";
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
