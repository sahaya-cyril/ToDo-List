//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(res, res) {
    const day = date.getDate();

    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to database.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: day, newListItems: foundItems });
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList) {
        if (!err){
            if (!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            list.save();
            res.redirect("/" + customListName);
            } else {
                //Show existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });
});

app.post("/", function (req, res) {
    const day = date.getDate();
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === day){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted the checked item.");
            res.redirect("/");
        }
    });
});

app.listen("3000", function(req, res) {
    console.log("Server is connected to port 3000");
});