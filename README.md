# Campground-Website(practice)

[Passport](https://www.udemy.com/) udemy class practice

bootstrap을 이용한 frontend와 nodejs와 npm을 활용한 backend의 기본 필수 요소들을 연습
#### 기능요약
* 게시물 작성
* 게시물 댓글 및 평점 기능
* 로그인 & 로그아웃
* 게시물 접근 권한 설정
* 이미지 업로드, 표시 및 삭제(mongoDB와 cloudinary모두)
* 지도 및 정보 표시

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

## Image Delete in mongo and cloudinary

* `cloudinary` - cloudinary.uploader.destroy(filename)
```js
  ---
  cloudinary
  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "Campground",
      allowedFormats: ["jpeg", "png", "jpg"],
    },
  });

  module.exports = {
    cloudinary,
    storage,
```
  ---
  controllers
  ---
```js
  const { cloudinary } = require("../cloudinary");

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updateCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }  
  };
```

## Map info

* `mapbox` - 
좌표 분석
```js
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
```
---
지도 표시
```js
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${campground.title}</h5><p>${campground.location}</p>`
    )
  )
  .addTo(map);
``` 