var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var mongoose   = require("mongoose");
var middleware = require("../middleware");


mongoose.set('useFindAndModify', false);

// =====================
// Comments Routes
//======================

// Comment New Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // Find Campground by ID 
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


// Comments Create Route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Lookup Campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){ 
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create New Comment
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something Went Wrong!");
                    console.log(err);
                } else { 
                    // Add Username and ID to Comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save Comment   
                    comment.save();
                    // Connect New Comment to Campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment Successfully Added");
                    // Redirect to Campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });  
});


// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id , function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Successfully Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;