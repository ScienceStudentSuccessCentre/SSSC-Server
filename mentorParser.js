var cheerio = require('cheerio');
var puppeteer = require('puppeteer');
var request = require('request');
var Mentor = require('./mentor.js');

const baseUrl = "http://sssc.carleton.ca";
const mentorsUrl = "/meet-our-mentors";
var mentors = [];

// gathers the HTML from the mentors page
// this is done using puppeteer instead of request because mentors don't appear on the page immediately after loading
function scrape() {
    console.log("Scraping " + baseUrl + mentorsUrl + "...");
    puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(baseUrl + mentorsUrl).then(function() {
                return page.content();
            });
        })
        .then(html => {
            parse(html);
        })
        .catch(console.error)
}

// parses a body of HTML to retrieve a list of mentors
function parse(body) {
    const mentors$ = cheerio.load(body, {
        normalizeWhitespace: true
    });
    mentors$('.person--container').each(function(i, element) {
        var mentor;
        console.log("Processing mentor: " + i);
        let element$ = cheerio.load(element);
        let mentorName = element$('.person--name').text().trim();
        let mentorUrl = element$('a').first().attr('href');
        let mentorDegree = "";
        let mentorBio = "";
        let mentorImageUrl = "";
        let mentorTeam = "";
        mentor = new Mentor(mentorName, mentorUrl);
        request(mentorUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let mentor$ = cheerio.load(body, {
                    normalizeWhitespace: true
                });
                const mentorProfile$ = cheerio.load((mentor$('.profile-full').html()), {
                    normalizeWhitespace: true
                });
                mentorDegree = mentorProfile$('.profile--degreeprogram').text()
                mentorBioHtml = mentorProfile$('.profile--bio div').html();
                if (mentorBioHtml) {
                    mentorBio = convertToHtmlText(mentorBioHtml);
                }
                mentorImageUrl = mentorProfile$('img').attr('src');
                if (mentorImageUrl) {
                    mentorImageUrl = baseUrl + mentorImageUrl;
                }
                mentorTeam = mentorProfile$('.taxonomy-tags').text()

                mentor.setDetails(mentorDegree, mentorBio, mentorImageUrl, mentorTeam);

                mentor.print();
                mentors.push(mentor);
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
    console.log("Failed to scrape mentors.");
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
}

// retrieves the list of mentors as JSON
function getMentors() {
    console.log("Retrieving mentors...");
    mentors.forEach(function(mentor) {
        mentor.print();
    });
    return JSON.stringify(mentors);
}

module.exports.scrape = scrape;
module.exports.getMentors = getMentors;
