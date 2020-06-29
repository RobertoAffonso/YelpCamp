var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds = [
    {name: "Salmon Creek", image: "https://pixabay.com/get/57e4d64a4a54ad14f1dc84609620367d1c3ed9e04e507440762c7cd59e4fc7_340.jpg"},
    {name: "Bright Falls", image: "https://cdn.mos.cms.futurecdn.net/Xvas2AtmtMk37WYHskDPfE-650-80.jpg.webp"},
    {name: "Granite Hills", image: "https://pixabay.com/get/53e0d2404e53ac14f1dc84609620367d1c3ed9e04e507440762c7cd59e49c7_340.jpg"}
]

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    res.send("YOU HIT THE POST ROUTE!");
});

app.get("/campgrounds/new", function(req, res){
    var name = req.body.name;
    var image = req.body.image
    var object = {name: name, image: image};
    campgrounds.push(object);
    res.redirect("campgrounds");
});

app.listen(3000, function() {
    console.log("Starting the YelpCamp App....");
});