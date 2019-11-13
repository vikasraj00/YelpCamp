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
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Kipling Camp", 
//         image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//         description: "Camping in the largest protected Tiger Reserve in the country has to be an unparalleled experience, right? The Kipling Camp is located in the Kanha National Park in Madhya Pradesh. This campsite is in the Satpura Hills refreshed by the water of the Narmada. Camping here lets you experience the dense wild forest and amazingly calm weather. The best thing to do here is to go bird watching or pursue a jungle safari. This one is a complete family vacation spot with the chance to make joyous memories."
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly Created Campground");
//             console.log(campground);
//         }
// });

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - Show all Campgrounds
app.get("/campgrounds", function(req, res){
    // Get All Campgrounds from the Database
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    }); 
});

// CREATE - Add new Campgrounds to Database
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});

// SHOW - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //Find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            //Render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    }); 
});

app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started on Port 3000");
});