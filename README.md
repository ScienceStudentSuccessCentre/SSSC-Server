# <!-- omit in toc --> Carleton Science Student Success Centre - Server

This is the server for the Carleton University Science Student Success Centre. You can find the SSSC iOS app code [here](https://github.com/ScienceStudentSuccessCentre/SSSC-iOS-App).

- [Project summary](#project-summary)
- [Setting up the project](#setting-up-the-project)
- [Brief overview of the internal workings](#brief-overview-of-the-internal-workings)

## Project summary

This project contains the server-side event-parsing code for the SSSC apps. Every 15 minutes, it scrapes the list of events from https://sssc.carleton.ca/events, as well as scrapes the individual events that are linked to from that page. From there, information is parsed and standardized, before being made available through the use of a GET request to `/events`.

If anything goes wrong in terms of how events are scraped and parsed from the website, this should be the first place to make modifications, as it does not require going through a formal app review process from Apple or Google (and thus can be updated very quickly).

## Setting up the project

1. Clone the repository: https://github.com/ScienceStudentSuccessCentre/SSSC-Server.git
2. Navigate into the directory
3. Run `npm install`

## Brief overview of the internal workings

- `app.js` contains the main routing code for server requests
- `eventParser` scrapes and parses event info from the SSSC website
- `event.js` contains the `Event` class, to make event parsing easier
