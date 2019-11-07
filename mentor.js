class Mentor {
    constructor(name, url) {
        this.id = url;
        this.name = name;
        this.url = url;
        console.log("Created mentor " + this.name + " (id " + this.id + ")");
    }

    // sets basic event details
    setDetails(degree, bio, imageUrl, team) {
        this.degree = degree;
        this.bio = bio;
        this.imageUrl = imageUrl;
        this.team = team;
        console.log("Set details for mentor " + this.name + " (id " + this.id + ")");
    }

    // prints event to the console
    print() {
        console.log("Mentor: " + this.name);
        console.log("\tID: " + this.id);
        console.log("\tURL: " + this.url);
        console.log("\tDegree: " + this.degree);
        console.log("\tBio: " + this.bio)
        console.log("\tImageURL: " + this.imageUrl);
        console.log("\tTeam: " + this.team);
    }
}

module.exports = Mentor;
