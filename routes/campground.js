var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCamp){
		if(err){
			console.log(err);
		}else{
		res.render("campgrounds/index", {campgrounds: allCamp});
		}
	});
});
router.get("/campgrounds/form",  function(req, res){
	res.render("campgrounds/form");
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", middleware.isLoggedIn, function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not  found");
			res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampgrounds = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
}else{
	res.redirect("/campgrounds");
}
	});
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit", {campground: foundCamp});
		}
	});
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCamp){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//DISTROY THE CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;