//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app =  express();

app.set("view engine", "ejs");

app.get("/", function(res, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    var offday = "weekday";

    if (currentDay == 0) {
        day = "Sunday";
        offday = "weekend";
    }
    else if (currentDay == 1){
        day = "Monday";
    }
    else if (currentDay == 2) {
        day = "Tuesday";
    }
    else if (currentDay == 3) {
        day = "Wednesday";
    }
    else if (currentDay == 4) {
        day = "Thursday";
    }
    else if (currentDay == 5) {
        day = "Friday";
    }
    else {
        day == "Saturday";
        offday == "weekend";
    }

    res.render("list", {kindOfDay: day, weekDay: offday});
});

app.listen("3000", function(req, res) {
    console.log("Server is connected to port 3000");
});