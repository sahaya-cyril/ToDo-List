//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app =  express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(res, res) {
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
    if (req.body.list === "Work") {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res) {
    const item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});

app.listen("3000", function(req, res) {
    console.log("Server is connected to port 3000");
});