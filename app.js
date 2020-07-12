var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to YelpCamp DB!"))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

// Compiled Campground Schema.
var Campground = mongoose.model("campground", campgroundSchema);

// Creating a Campground.
// Campground.create(
//     {name: "Granite Hills", 
//      image: "https://ewscripps.brightspotcdn.com/dims4/default/a844161/2147483647/strip/true/crop/640x360+0+60/resize/1280x720!/quality/90/?url=https%3A%2F%2Fsharing.fox47news.com%2Fsharescnn%2Fphoto%2F2015%2F05%2F29%2FTentCamping_1432912560973_18976473_ver1.0_640_480.jpg"
//     }, function(err, createdCampground){
//         if(err) {
//             console.log("There was an error creating a new Campground...");
//         } else {
//             console.log(createdCampground);
//         }
//     });


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    // res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("There was an error loading all campgrounds.");
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image
    var object = {name: name, image: image};

    Campground.create(object, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else {
            res.redirect("campgrounds");
        }
    });    
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function() {
    console.log("Starting the YelpCamp App....");
});