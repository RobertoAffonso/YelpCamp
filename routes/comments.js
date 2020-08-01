var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
const { json } = require("body-parser");

// Comments Show
// http://localhost:3000/campgrounds/5f25e7967ac3a036f8909b74/comments/new
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            var newComment = Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else { 
                    //add username and id to comment
                    //save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;