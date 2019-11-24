var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var mongoose   = require("mongoose");

mongoose.set('useFindAndModify', false);

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
                    // Add Username and ID to Comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save Comment   
                    comment.save();
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


// Comment Edit Route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment Update Route
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Destroy Route
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id , function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {        
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // Does the user own the Comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;