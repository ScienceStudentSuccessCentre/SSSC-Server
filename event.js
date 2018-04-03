class Event {
    constructor(event) {
        parseScrapeData(event)
    }

    constructor(name, description, year, month, day, time, location, url, imageUrl) {
        this.name = name;
        this.description = description;
        this.year = year;
        this.month = month;
        this.day = day;
        this.time = time;
        this.location = location;
        this.url = url;
        this.imageUrl = imageUrl;
    }

    parseScrapeData() {
        
    }
}