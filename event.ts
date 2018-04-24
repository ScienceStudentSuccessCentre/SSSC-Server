class Event {
    public name: string;
    public url: string;
    public year: number;
    public month: string;
    public day: number;
    public description?: string;
    public time?: string;
    public location?: string;
    public imageUrl?: string;

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
}

export default Event;