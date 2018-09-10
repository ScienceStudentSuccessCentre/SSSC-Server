class Event {
    private name: string;
    private url: string;
    private year: number;
    private month: string;
    private day: number;
    private description?: string;
    private time?: string;
    private location?: string;
    private imageUrl?: string;

    constructor(name: string, url: string, year: number, month: string, day: number) {
        this.name = name;
        this.url = url;
        this.year = year;
        this.month = month;
        this.day = day;
        console.log("Created event: " + name + ", " + url + ", " + year + ", " + month + ", " + day);
    }

    setDetails(description: string, time: string, location: string, imageUrl: string) {
        this.description = description;
        this.time = time;
        this.location = location;
        this.imageUrl = imageUrl;
        console.log("Set details");
    }

    print() {
        console.log("Event: " + this.name);
        console.log("\tURL: " + this.url);
        console.log("\tDate: " + this.month + " " + this.day + ", " + this.year);
        console.log("\tDescription: " + this.description);
        console.log("\tTime: " + this.time);
        console.log("\tLocation: " + this.location);
        console.log("\tImageURL: " + this.imageUrl);
    }
}

export default Event;
