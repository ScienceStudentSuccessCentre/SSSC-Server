"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event(name, url) {
        this.id = url.replace("/node/", "");
        this.name = name;
        this.url = url;
        console.log("Created event " + this.name + " (id " + this.id + ")");
    }
    Event.prototype.setDetails = function (description, date, time, location, imageUrl, actionUrl) {
        this.description = description;
        this.dateTime = date;
        this.rawTime = time;
        this.location = location;
        this.imageUrl = imageUrl;
        this.actionUrl = actionUrl;
        console.log("Set details for event " + this.name + " (id " + this.id + ")");
        if (this.dateTime && this.rawTime) {
            this.attemptToParseTime();
            this.correctTimeToUtc();
        }
    };
    Event.prototype.attemptToParseTime = function () {
        var parseTimeRegex = /^(\d):?(\d{2})?\s*?([apmAPM]{2})/g;
        var timeMatch = parseTimeRegex.exec(this.rawTime);
        if (timeMatch) {
            var hours = Number(timeMatch[1]);
            var minutes = Number(timeMatch[2]);
            var period12Hours = timeMatch[3];
            if (!hours) {
                hours = 12;
            }
            if (!minutes) {
                minutes = 0;
            }
            if (period12Hours) {
                period12Hours = period12Hours.toLowerCase();
            }
            else {
                period12Hours = "pm";
            }
            if (period12Hours.indexOf("pm") !== -1 && hours < 12) {
                hours += 12;
            }
            this.dateTime.setHours(hours);
            this.dateTime.setMinutes(minutes);
            console.log("Set time to " + this.dateTime + " for event " + this.name + " (id " + this.id + ")");
        }
    };
    Event.prototype.correctTimeToUtc = function () {
        var easternDateTime = new Date(this.dateTime.toLocaleString("en-US", { timeZone: "America/New_York" }));
        var timezoneOffsetMillis = easternDateTime.getTime() - this.dateTime.getTime();
        this.dateTime = new Date(this.dateTime.getTime() + timezoneOffsetMillis);
    };
    Event.prototype.print = function () {
        console.log("Event: " + this.name);
        console.log("\tID: " + this.id);
        console.log("\tURL: " + this.url);
        console.log("\tDescription: " + this.description);
        console.log("\tDate and Time: " + this.dateTime);
        console.log("\tRaw Time: " + this.rawTime);
        console.log("\tLocation: " + this.location);
        console.log("\tImageURL: " + this.imageUrl);
        console.log("\tActionURL: " + this.actionUrl);
    };
    return Event;
}());
exports.default = Event;
