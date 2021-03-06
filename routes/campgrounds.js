var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

//=============
// ROUTES
//=============
// INDEX
router.get("/", function(req, res){
    // GET all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            req.flash("error", "Oh, no! Error!");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
// POST
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from input form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
        // Create new campground, save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
                console.log(newlyCreated);
                // redirect back to the campgrounds page
                req.flash("success", "Your campsite has been added!");
                res.redirect("/campgrounds");
            }
        });
    });
});
// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    // Find campground with ':id'; display that campground's details
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            req.flash("error", err.message);
            res.render('/login');
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        // find and update
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updateCampground){
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // destory campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;