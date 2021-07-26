# Campground-Website(practice)

[Passport](https://www.udemy.com/) udemy class practice

bootstrap을 이용한 frontend와 nodejs와 npm을 활용한 backend의 기본 필수 요소들을 연습
#### 기능요약
* 게시물 작성
* 게시물 댓글 및 평점 기능
* 로그인 & 로그아웃
* 게시물, 댓글 접근 권한 설정

---

<p align="left">
  <sup>순서</sup>
  <br>
  - ![Routing and Database](#Routing-and-Database)
  - ![CRUD System](#CRUD-System)
  - ![Error Handle](#Error-Handle)
  - ![Review](#Review)
  - ![Restructing and Refactoring](#Restructing-and-Refactoring)
  - ![Flash](#Flash)
  - ![Login/Logout](#Login/Logout)
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

## Authorization

* `클라이언트 측 접근 방어`
* 게시물 혹은 리뷰 생성시 request를 보낸 id를 게시물의 author로 등록함
* edit 혹은 delete요청 시 게시물 혹은 리뷰의 author와 현재 세션의 id와 일치하는지를 판단함
* ejs를 활용한 edit, delete버튼을 일치여부를 판단하여 숨김
* `주소를 사용한 접근 방어` - 클라이언트 측 접근 방어와 같은 방식으로 id가 일치하는지 판단
```js
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "접근 권한이 없습니다.");
      return res.redirect(`/campgrounds/${id}`);
    }
    if (!campground) {
      req.flash("error", "there is no campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(currentUser._id)) {
      req.flash("error", "삭제 권한이 없습니다.");
      return res.redirect(`/campgrounds/${id}`);
    }
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
```