const express=require("express");
const router= express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

// reviews
// post review request
router.post("/", async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${id}`);

});
// delete request
router.post("/:reviewId", async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);

});


module.exports=router;