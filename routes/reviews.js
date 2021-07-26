const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressError");

const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.post));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.delete)
);

module.exports = router;
