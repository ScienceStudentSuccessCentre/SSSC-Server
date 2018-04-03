$(document).ready(function() {

    $("#resetTraining").on('click', function() {
        $("#frame").attr("srcdoc", "<html><body></body></html>");
        loadFrame("/reset/training");
    });

    $("#resetTesting").on('click', function() {
        $("#frame").attr("src", "about:blank");
        loadFrame("/reset/testing");
    });

    $("#context").on('click', function() {
        loadFrame("/context");
    });

    $("#community").on('click', function() {
        loadFrame("/community");
    });

    $("#fetch").on('click', function() {
        loadFrame("/fetch");
    });

    $("#advertising").on('click', function() {
        var genre = window.prompt("Enter the genre of the advertising you want to view.", "");
        if (genre != null && genre != "") {
            loadFrame("/advertising/" + genre.toLowerCase());
        }
    });

});

let baseURL = "http://localhost:8080/COMP4601-RS/rest/rs";

function loadFrame(frameURL) {
    $.get(baseURL + frameURL, function(data) {
        console.log(data);
        $("#frame").attr("srcdoc", data);
    })
}

function promptForUser(page) {
    var user = window.prompt("Enter the name of the user that is visiting this page.", "");
    if (user != null && user != "") {
        loadFrame("/fetch/" + user + "/" + page);
    }
}