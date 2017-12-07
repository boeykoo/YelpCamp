var mongoose = require("mongoose");
var Campground = require("./modules/campground");
var Comment = require("./modules/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://s.hswstatic.com/gif/desert-camping-large.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
    ];
    
    function seedDB(){
        //remove all campgrounds
        Campground.remove({}, function(err){
            if(err) {
                console.log(err);
            } else {
                console.log("removed all campgrounds");
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("added a campground");
                            Comment.create({
                                text: "this place is great, i wish i can live here forever",
                                author: "Dan"
                            }, function(err, comment){
                                if(err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created a new comment");
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    
    module.exports = seedDB;