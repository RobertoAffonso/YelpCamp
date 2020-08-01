var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

// INDEX - Show all Campgrounds
router.get("/", function(req, res) {
    // res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("There was an error loading all campgrounds.");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add new Campground to Database.
router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var object = {name: name, image: image, description: desc, author: author};
    console.log(object);
    Campground.create(object, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else {
            res.redirect("campgrounds");
        }
    });    
});

// NEW - Show form to create a new Campground.
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one Campground.
router.get("/:id", function(req, res) {
    // find the campground with the provided ID
    // render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;