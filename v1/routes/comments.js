var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");

// =====================
// Comments Routes
//======================

router.get("/new", isLoggedIn, function(req, res) {
    // Find Campground by ID 
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    // Lookup Campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){ 
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create New Comment
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {    
                    // Connect New Comment to Campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect to Campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });  
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;