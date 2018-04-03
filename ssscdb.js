const $ = module.exports;

$.scrape = function() {
    console.log("Scraping...");
}

$.getEvents = function() {
    console.log("Retrieving events...");
    return JSON.stringify({"key": "value"});
}