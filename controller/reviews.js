const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.creatReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    const newReview = new Review(req.body.review) // Ensure req.body.review has both comment and rating
    newReview.author = req.user._id;


    listing.reviews.push(newReview);// Push the new review's ObjectId into the listing's reviews array

    await newReview.save() // Save the new review
    await listing.save() // Save the listing with the new review reference


    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`)
  };

  module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`)
  };