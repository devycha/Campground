const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expressError");

const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("inavlid campground data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect("/campgrounds");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "there is no campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateCamp = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      {
        runValidators: true,
        new: true,
      }
    );
    req.flash("success", "Successfully updated the campground!!");
    res.redirect(`/campgrounds/${updateCamp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "there is no campground");
      return res.redirect("/campgrounds");
    }
    let reviewAverage = 0;
    for (let i = 0; i < campground.reviews.length; i++) {
      reviewAverage += campground.reviews[i].rating;
    }
    reviewAverage = (reviewAverage / campground.reviews.length).toFixed(2);
    res.render("campgrounds/show", { campground, reviewAverage });
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const deleteCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully delete it!!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
