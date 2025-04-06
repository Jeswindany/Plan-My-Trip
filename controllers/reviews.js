const Hotspot = require("../models/hotspot");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const hotspot = await Hotspot.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  hotspot.reviews.unshift(review);
  await review.save();
  await hotspot.save();
  req.flash("success", "Created new review!");
  res.redirect(`/hotspots/${hotspot._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Hotspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/hotspots/${id}`);
};
