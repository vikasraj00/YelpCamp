var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"), 
    mongoose      = require("mongoose"), 
    passport      = require("passport"), 
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")


mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
seedDB();


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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
    res.render("campgrounds/new")
});

// SHOW - Shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
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



// =====================
// Comments Routes
//======================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    // Find Campground by ID 
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
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






app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started on Port 3000");
});