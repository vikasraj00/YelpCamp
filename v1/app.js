var express = require("express");
var app = express();
var bodyParser = require("body-parser");  
var mongoose = require("mongoose");  


mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Kipling Camp", 
//         image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly Created Campground");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // Get All Campgrounds from the Database
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    }); 
});

app.post("/campgrounds", function(req, res){
    // Get data from the form and add it to the Campgrounds Array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
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

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});

app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started");
});