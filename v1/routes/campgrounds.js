var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");


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
router.post("/", function(req, res){
    // Get data from the form and add it to the Campgrounds Array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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
router.get("/new", function(req, res) {
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

module.exports = router;