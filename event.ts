class Event {
    private id: string;
    private name: string;
    private url: string;
    private year: number;
    private month: string;
    private day: number;
    private description?: string;
    private time?: string;
    private location?: string;
    private imageUrl?: string;
    private actionUrl?: string;

    constructor(name: string, url: string, year: number, month: string, day: number) {
        this.id = url.replace("/node/", "");
        this.name = name;
        this.url = url;
        this.year = year;
        this.month = month;
        this.day = day;
        console.log("Created event: " + this.id + ", " + this.name + ", " + this.url + ", " + this.year + ", " + this.month + ", " + this.day);
    }

    setDetails(description: string, time: string, location: string, imageUrl: string, actionUrl: string) {
        this.description = description;
        this.time = time;
        this.location = location;
        this.imageUrl = imageUrl;
        this.actionUrl = actionUrl;
        console.log("Set details");
    }

    print() {
        console.log("Event: " + this.name);
        console.log("\tID: " + this.id);
        console.log("\tURL: " + this.url);
        console.log("\tDate: " + this.month + " " + this.day + ", " + this.year);
        console.log("\tDescription: " + this.description);
        console.log("\tTime: " + this.time);
        console.log("\tLocation: " + this.location);
        console.log("\tImageURL: " + this.imageUrl);
        console.log("\tActionURL: " + this.actionUrl);
    }
}

export default Event;
