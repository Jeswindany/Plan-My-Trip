const { hotspotSchema, reviewSchema } = require("./schemas");
const Hotspot = require("./models/hotspot");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const hotspot = await Hotspot.findById(id);
  if (!hotspot.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/hotspots/${id}`);
  }
  next();
};

module.exports.validateHotspot = (req, res, next) => {
  // if (!req.body.hotspot) throw new ExpressError('Invalid Hotspot Data', 400);
  const { error } = hotspotSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/hotspots/${id}`);
  }
  next();
};
