const $ = module.exports;

var ssscdb = [];

$.scrape = function() {
    console.log("Scraping...");
    request('http://sssc.carleton.ca/events', function (error, response, body) {
		
	});
}

$.getEvents = function() {
    console.log("Retrieving events...");
    
    return JSON.stringify({"key": "value"});
}