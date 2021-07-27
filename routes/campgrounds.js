const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(campgrounds.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.post)
  );
// .post(upload.single("image"), (req, res) => {
//   console.log(req.body, req.file);
//   res.send("it works!");
// })
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("it works!");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.show))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.put)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

module.exports = router;
