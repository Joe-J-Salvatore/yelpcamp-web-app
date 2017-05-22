var Campground = require("../models/campground");
var Comment = require("../models/comment");

// middleware =>
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    // if not redirect
                    req.flash("error", "Permission denied!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // otherwise, redirect
        req.flash("error", "You must be logged in!");
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
     if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    // if not redirect
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        // otherwise, redirect
        req.flash("error", "You must be logged in");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login required");
    res.redirect("/login");
};

module.exports = middlewareObj;