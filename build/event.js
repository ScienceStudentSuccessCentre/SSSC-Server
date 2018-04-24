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
    return Event;
}());
exports.default = Event;
