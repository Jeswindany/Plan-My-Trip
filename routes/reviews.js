const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews.js");

const catchAsync = require("../utils/catchAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Hotspot = require("../models/hotspot");
const Review = require("../models/review.js");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
