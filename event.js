class Event {
    constructor(name, url, year, month, day) {
        this.name = name;
        this.url = url;
        this.year = year;
        this.month = month;
        this.day = day;
        console.log("Created event: " + name + ", " + url + ", " + year + ", " + month + ", " + day);
    }

    setDetails(description, time, location, imageUrl) {
        this.description = description;
        this.time = time;
        this.location = location;
        this.url = url;
        this.imageUrl = imageUrl;
        console.log("Set details");
    }
}

module.exports = Event;