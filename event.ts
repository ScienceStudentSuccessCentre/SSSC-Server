class Event {
    private id: string;
    private name: string;
    private url: string;
    private dateTime?: Date;
    private description?: string;
    private rawTime?: string;
    private location?: string;
    private imageUrl?: string;
    private actionUrl?: string;

    constructor(name: string, url: string) {
        this.id = url.replace("/node/", "");
        this.name = name;
        this.url = url;
        console.log("Created event " + this.name + " (id " + this.id + ")");
    }

    public setDetails(description: string, date: Date, time: string, location: string, imageUrl: string, actionUrl: string) {
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
    }

    private attemptToParseTime() {
        let parseTimeRegex = /^(\d):?(\d{2})?\s*?([apmAPM]{2})/g;
        let timeMatch = parseTimeRegex.exec(this.rawTime!);
        if (timeMatch) {
            let hours = Number(timeMatch[1]);
            let minutes = Number(timeMatch[2]);
            let period12Hours = timeMatch[3];

            if (!hours) {
                hours = 12
            }
            if (!minutes) {
                minutes = 0
            }
            if (period12Hours) {
                period12Hours = period12Hours.toLowerCase()
            } else {
                period12Hours = "pm"
            }
            if (period12Hours.indexOf("pm") !== -1 && hours < 12) {
                hours += 12;
            }

            this.dateTime!.setHours(hours);
            this.dateTime!.setMinutes(minutes);
            console.log("Set time to " + this.dateTime! + " for event " + this.name + " (id " + this.id + ")");
        }
    }

    private correctTimeToUtc() {
        let easternDateTime = new Date(this.dateTime!.toLocaleString("en-US", {timeZone: "America/New_York"}));
        let timezoneOffsetMillis = easternDateTime.getTime() - this.dateTime!.getTime()
        this.dateTime = new Date(this.dateTime!.getTime() + timezoneOffsetMillis);
    }

    public print() {
        console.log("Event: " + this.name);
        console.log("\tID: " + this.id);
        console.log("\tURL: " + this.url);
        console.log("\tDescription: " + this.description);
        console.log("\tDate and Time: " + this.dateTime)
        console.log("\tRaw Time: " + this.rawTime);
        console.log("\tLocation: " + this.location);
        console.log("\tImageURL: " + this.imageUrl);
        console.log("\tActionURL: " + this.actionUrl);
    }
}

export default Event;
