var cheerio = require('cheerio');
var request = require('request');
var Event = require('./event.js');

const baseUrl = "http://sssc.carleton.ca";
const eventsUrl = "/events";
var events = [];

// gathers the HTML from the events page
function scrape() {
    console.log("Scraping " + baseUrl + eventsUrl + "...");
    request(baseUrl + eventsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            events = [];
            parse(body);
        } else {
            failedScrape(error, response, body);
        }
	});
}

// parses a body of HTML to retrieve a list of events
function parse(body) {
    const events$ = cheerio.load(body, {
        normalizeWhitespace: true
    });
    events$('.event-listing--list-item').each(function(i, element) {
        var event;
        console.log("Processing event: " + i);
        let element$ = cheerio.load(element);
        let eventName = element$('.event-details--title').text().trim();
        let eventUrl = element$('a').first().attr('href');
        let eventDescription = "";
        let eventDate = new Date();
        let eventTime = "";
        let eventLocation = "";
        let eventImageUrl = "";
        let eventActionUrl = "";
        event = new Event(eventName, eventUrl);
        request(baseUrl + eventUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let event$ = cheerio.load(body, {
                    normalizeWhitespace: true
                });
                const rawEventDescription$ = cheerio.load((event$('.event--description').html()), {
                    normalizeWhitespace: true
                });
                eventImageUrl = rawEventDescription$('img').attr('src');
                if (eventImageUrl) {
                    eventImageUrl = baseUrl + eventImageUrl;
                }
                let eventDescriptionHtml = event$('.event--description').html();
                if (eventDescriptionHtml) {
                    eventDescription = convertToHtmlText(eventDescriptionHtml);
                }
                const eventDetails$ = cheerio.load((event$('.event--details').html()), {
                    normalizeWhitespace: true
                });
                eventDetails$('.row').each(function(i, detail) {
                    const detail$ = cheerio.load(detail);
                    let eventDetailRaw = detail$('.event-detail--content');
                    let eventDetail = eventDetailRaw.text().trim();
                    let eventDetailHtml = eventDetailRaw.html();
                    if (detail$('.fa-clock-o').length > 0) {
                        eventTime = detail$('.event-detail--content').text().trim();
                    } else if (detail$('.fa-leanpub').length > 0) {
                        if (eventDetailHtml) {
                            eventActionUrl = detail$('a').first().attr('href');
                        }
                    } else if (detail$('.fa-map-marker').length > 0) {
                        eventLocation = eventDetail;
                    } else if (detail$('.fa-calendar').length > 0) {
                        eventDate = new Date(Date.parse(eventDetailRaw.find('time').attr('datetime')))
                    }
                });
                event.setDetails(eventDescription, eventDate, eventTime, eventLocation, eventImageUrl, eventActionUrl);

                event.print();
                events.push(event);
            } else {
                failedScrape(error, response, body);
            }
        });
    });
}

// strips out only certain HTML tags, so that things like lists and links are maintained in the apps
function convertToHtmlText(html) {
    let whitelist = ['a', 'ul', 'ol', 'li'];

    let normalizeListElementsRegexReplace1 = /<li>\s*<p>\s*/gi;
    let normalizeListElementsRegexReplacement1 = '<li>';
    let normalizeListElementsRegexReplace2 = /\s*<\/p>\s*<\/li>/gi;
    let normalizeListElementsRegexReplacement2 = '</li>';
    let normalizeListElementsRegexReplace3 = /<br \/>\s*<li>/gi
    let normalizeListElementsRegexReplacement3 = '<li>';
    let normalizeListElementsRegexReplace4 = /<br \/><\/ul>/gi
    let normalizeListElementsRegexReplacement4 = '</ul><br />';
    let normalizeListElementsRegexReplace5 = /<br \/><ul>/gi
    let normalizeListElementsRegexReplacement5 = '<ul>';

    if (html != null) {
        html = html.replace(normalizeListElementsRegexReplace1, normalizeListElementsRegexReplacement1);
        html = html.replace(normalizeListElementsRegexReplace2, normalizeListElementsRegexReplacement2);
    }

    whitelist.forEach(element => {
        if (html != null) {
            html = cheerio.load(html.split('<' + element + '>')
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
        html = cheerio.load(html, {
            normalizeWhitespace: true
        }).root().text();
    }
    whitelist.forEach(element => {
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

// scraping went wrong (oh no)
function failedScrape(error, response, body) {
    console.log("Failed to scrape events.");
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}

// retrieves the list of events as JSON
function getEvents() {
    console.log("Retrieving events...");
    events.forEach(function(event) {
        event.print();
    });
    return JSON.stringify(events);
}

module.exports.scrape = scrape;
module.exports.getEvents = getEvents;
