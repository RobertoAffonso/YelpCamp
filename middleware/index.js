var middlewareObj = {};
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don´t have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // Checks if the User owns the Comment.
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don´t have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.loadCampgrounds = function(req, res, next) {
    if(req.query && req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search));
        Campground.find({name:regex}, function(err, foundCampgrounds) {
            if(err){
                req.flash("error", "There was an error loading the campgrounds.");
                res.redirect("back");
            } else {
                if(foundCampgrounds.length === 0) {
                    req.flash("error", "No campgrounds match that query, please try again.");
                    res.redirect("back");
                } else {
                    res.locals.foundCampgrounds = foundCampgrounds;
                    next();
                }
            }
        });
    } else {
        Campground.find({}, function(err, foundCampgrounds){
           if(err){
               console.log(err);
           } else {
            res.locals.foundCampgrounds = foundCampgrounds;
            next();
        }
    });
}
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = middlewareObj;