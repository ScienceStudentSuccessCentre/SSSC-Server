"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event(name, url, year, month, day) {
        this.name = name;
        this.url = url;
        this.year = year;
        this.month = month;
        this.day = day;
        console.log("Created event: " + name + ", " + url + ", " + year + ", " + month + ", " + day);
    }
    Event.prototype.setDetails = function (description, time, location, imageUrl) {
        this.description = description;
        this.time = time;
        this.location = location;
        this.imageUrl = imageUrl;
        console.log("Set details");
    };
    Event.prototype.print = function () {
        console.log("Event: " + this.name);
        console.log("\tURL: " + this.url);
        console.log("\tDate: " + this.month + " " + this.day + ", " + this.year);
        console.log("\tDescription: " + this.description);
        console.log("\tTime: " + this.time);
        console.log("\tLocation: " + this.location);
        console.log("\tImageURL: " + this.imageUrl);
    };
    return Event;
}());
exports.default = Event;
