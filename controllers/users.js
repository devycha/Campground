const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  const { username } = req.body;
  const redirectURL = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  req.flash("success", `${username}님 환영합니다!`);
  res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("success", "로그아웃 되었습니다.");
  }
  res.redirect("/campgrounds");
};
