const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
}

//Created Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//Created model
const Item = mongoose.model("Item", itemsSchema);

//Creating items
const item1 = new Item({
  name: "Welcome to your todo list."
});

const item2 = new Item({
  name: "Hit + button to create a new item."
});

const item3 = new Item({
  name: "Hit ❌ to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

  Item.find({}).then(function (foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
        .then(function () {
          console.log("Successfully saved into our DB.");
        })
        .catch(function (err) {
          console.log(err);
        });
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  })
    .catch(err => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemId = req.body.itemIndex;
  Item.findByIdAndDelete(itemId)
    .catch(err => {
      console.log(err);
    });

  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});   