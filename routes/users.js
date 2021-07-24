const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "성공적으로 회원가입 되었습니다!");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { username } = req.body;
    const redirectURL = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    req.flash("success", `${username}님 환영합니다!`);
    res.redirect(redirectURL);
  }
);

router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("success", "로그아웃 되었습니다.");
  }
  res.redirect("/campgrounds");
});

module.exports = router;
