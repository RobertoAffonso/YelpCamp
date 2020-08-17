var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
var seedDb = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
authRoutes = require("./routes/index");

// Connecting to Database
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Connected to YelpCamp DB!"))
.catch(error => console.log(error.message));

// App configuration.
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());

// Seeding database
//seedDb();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Trust no 1",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Starting the Server in port 3000.
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Starting the YelpCamp App....");
});