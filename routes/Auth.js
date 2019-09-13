var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground =require("../models/campground");

router.get("/", function(req, res){
	res.render("landing");
});

//AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
});
router.post("/register", function(req, res){
	var newUser = User(
		{
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			avatar: req.body.avatar
		});
	if(req.body.admincode === "secretcode123"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
// AUTH LOGIN
router.get("/login", function(req, res){
	res.render("login");
});
router.post("/login", passport.authenticate("local",
	{
	    successRedirect: "/campgrounds",
	    failureRedirect: "/login"
}), function(req, res){
	
});

//LOGOUT rOUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out !!!");
	res.redirect("/campgrounds");
});

//USER Routes
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Something Went Wrong!!!");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			if(err){
			req.flash("error", "Something Went Wrong!!!");
			res.redirect("/");
		}else{
			res.render("user/show", {user:foundUser, campgrounds:campgrounds});
		}
		});
	});
});
module.exports = router;