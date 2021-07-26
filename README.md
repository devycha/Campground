# Campground-Website(practice)

[Passport](https://www.udemy.com/) udemy class practice

bootstrap을 이용한 frontend와 nodejs와 npm을 활용한 backend의 기본 필수 요소들을 연습
#### 기능요약
* 게시물 작성
* 게시물 댓글 및 평점 기능
* 로그인 & 로그아웃
* 게시물 접근 권한 설정 (예정)

---

<p align="left">
  <sup>순서</sup>
  <br>
  - [!Routing and Database](#Routing-and-Database)
  - [!CRUD System](#CRUD-System)
  - [!Error Handle](#Error-Handle)
  - [!Review](#Review)
  - [!Restructing and Refactoring](#Restructing-and-Refactoring)
  - [!Flash](#Flash)
  - [!Login/Logout](#Login/Logout)
</p>

---

[![npm](https://img.shields.io/npm/v/passport-local.svg)](https://www.npmjs.com/package/passport-local)

## Routing and Database

* `express`
* `mongoose` - mongoose.connection("mongodb://localhost:27017/")

## CRUD System

* `Shcema` - mognoose.model
* `ejs` - views
* `method-override` - Create, Read, Update, Delete
* `path` - basic path of views

## Error Handle

* `middleware`
* `async function`
* `Joi` - required conditions and options
* `Validate with Middleware`

## Review

* `Schema Relationship` - mongoose.Schema.Types.ObjectId
* `CRUD`
* `Joi`

## Restructing and Refactoring

* `Routes Directory`
* `Public Scripts`
* `Joi`
* `router.route()`

## Flash

* `Session` - res.locals
* `Flash` - 'connect-flash' - res.locals.success or fail = res.flash("success or fail")
* `express`

## Login/Logout

* `Passport` - isAuthenticated(), Middleware
```js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인이 필요합니다");
    return res.redirect("/login");
  }
  next();
};
```
* `req.session` - return to originalURL when user clicked before
```js
req.session.returnTo = req.originalUrl
const redirectURL = req.session.returnTo || "/campgrounds"; // login post
res.redirect(redirectURL)
```

## Image Upload

* `Multer` - upload.array, upload.single...
* `Cloudinary` - do not save in mongoDB because of its big size
* `dotenv` - security