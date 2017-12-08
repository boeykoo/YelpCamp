var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../modules/campground");
var Comment = require("../modules/comment");
var middleware = require("../middleware");

//Comments new 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//also need isLoggedIn in case someone just post from app like postman
router.post("/", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {//create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", err.message);
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//add comment edit route
//This one is really CONFUSING!!!!!!!!!!!!!!!!
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
            //Attention: it redirect to campground page not /campgrounds/comments/comment_id
        }
    });
});

//DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;