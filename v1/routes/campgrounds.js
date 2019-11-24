var express    = require("express");
var router     = express.Router();
var mongoose   = require("mongoose");
var Campground = require("../models/campground");
var middleware = require("../middleware");

mongoose.set('useFindAndModify', false);


// INDEX - Show all Campgrounds
router.get("/", function(req, res){
    // Get All Campgrounds from the Database
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    }); 
});

// CREATE - Add new Campgrounds to Database
router.post("/", middleware.isLoggedIn, function(req, res){
    // Get data from the form and add it to the Campgrounds Array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    //Create a new campground and save it to the database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            //Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Show Form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
});

// SHOW - Shows more info about one campground
router.get("/:id", function(req, res) {
    //Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // Find and Update the Campground
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // Redirect to Showpage
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy/Delete Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;