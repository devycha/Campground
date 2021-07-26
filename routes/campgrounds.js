const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressError");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(campgrounds.index)
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.post));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.show))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.put))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports = router;
