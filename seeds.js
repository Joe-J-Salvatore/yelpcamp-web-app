var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
    name: "Campground-01",
    image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
    description: "Tranquil beauty in all directions! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus in massa tempor nec feugiat nisl. Felis eget nunc lobortis mattis aliquam faucibus purus in massa."
}, {
    name: "Campground-02",
    image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
    description: "Tranquil beauty in all directions! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus in massa tempor nec feugiat nisl. Felis eget nunc lobortis mattis aliquam faucibus purus in massa."
}, {
    name: "Campground-03",
    image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
    description: "Tranquil beauty in all directions! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus in massa tempor nec feugiat nisl. Felis eget nunc lobortis mattis aliquam faucibus purus in massa."
}];

// Remove some campgrounds
function seedDB() {
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("Removed campgrounds");
        // Add some campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground!");
                    // Create some comments
                    Comment.create({text: "This place is amazing, but I wish it had internet access!", author: "John"}, function(err, comment){
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                            
                    });
                }
            });
        });
    });
}

module.exports = seedDB;