var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var expressSession = require("express-session");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
//seedDB();
//requiring routes
var campgroundRoutes = require("./routes/campground");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/Auth");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Holyshit",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
///Refectoring Routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, function(){
	console.log("Yelpcamp server has started!!!");
});