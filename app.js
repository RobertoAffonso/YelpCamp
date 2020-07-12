var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
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
    image: String,
    description: String
});

// Compiled Campground Schema.
var Campground = mongoose.model("campground", campgroundSchema);

// Creating a Campground.
// Campground.create(
//     {name: "Granite Hills", 
//      image: "https://ewscripps.brightspotcdn.com/dims4/default/a844161/2147483647/strip/true/crop/640x360+0+60/resize/1280x720!/quality/90/?url=https%3A%2F%2Fsharing.fox47news.com%2Fsharescnn%2Fphoto%2F2015%2F05%2F29%2FTentCamping_1432912560973_18976473_ver1.0_640_480.jpg",
//      description: "This is a huge granite hill, no bathrooms. No water. Beautiful Granite!"
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

// INDEX - Show all Campgrounds
app.get("/campgrounds", function(req, res) {
    // res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("There was an error loading all campgrounds.");
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add new Campground to Database.
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image
    var desc = req.body.description;
    var object = {name: name, image: image, description: desc};

    Campground.create(object, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else {
            res.redirect("campgrounds");
        }
    });    
});

// NEW - Show form to create a new Campground.
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// SHOW - shows more info about one Campground.
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with the provided ID
    // render show template with that campground
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err)
        } else {
            res.render("show", {campground: foundCampground});
        }
    })
});

app.listen(3000, function() {
    console.log("Starting the YelpCamp App....");
});