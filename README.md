# Campground-Website(practice)
## <a href="https://campground-heroku.herokuapp.com">배포 주소</a>

[Passport](https://www.udemy.com/) udemy class practice

bootstrap을 이용한 frontend와 nodejs와 npm을 활용한 backend의 기본 필수 요소들을 연습
#### 목차
* [게시물 작성](#Routing-and-Database)
* [게시물 댓글 및 평점 기능](#CRUD-System)
* [로그인 & 로그아웃](#Login/Logout)
* [게시물 접근 권한 설정](#Authorization)
* [이미지 업로드, 표시 및 삭제(mongoDB와 cloudinary모두)](#Image-Upload)
* [지도 및 정보 표시](#Cluster-Map)
* [기본적인 보안](#Basic-Security-Issue-Handle)
* [배포](#Deploy)

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

## Authorization
  - res.locals.currentUser = req.user
  - 게시물 혹은 댓글 생성 당시 req.user의 데이터를 해당 글의 author에 저장
  ### client-side
  * `비로그인시 접근 차단` 
    - currentUser 값이 없으면 ejs를 통하여 정보를 보여주지 않음
  * `로그인계정이 작성한 글이 아닌 경우 접근 차단` 
    - 해당 글의 author와 currentUser의 정보가 일치하지 않으면 ejs를 통하여 다른 정보로 접근 가능한 물리 버튼 등을 차단함
  ### other-side (postman을 통한 request요청과 url을 통한 직접 접근 시)
  * `비로그인시 접근 차단` 
    - req.isAuthenticated()를 통해 false의 값을 갖게 되면 login페이지로 강제 redirect 실행함
  * `로그인계정이 작성한 글이 아닌 경우 접근 차단` 
    - 임의의 같거나 다른 계정으로 로그인 후 게시글 댓글에 req 요청시 해당 글의 author과 현재 req.user의 정보가 같은지를 판단하여 강제로 redirect함

## Image Upload

* `Multer` - upload.array, upload.single...
* `Cloudinary` - do not save in mongoDB because of its big size
* `dotenv` - security

## Image Delete in mongo and cloudinary

* `cloudinary` - cloudinary.uploader.destroy(filename)
```js
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

* `mapbox`
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

## Cluster Map

* `Mapbox` - East Sea와 Sea of Japan이 같이 표기되어있는 것을 보고 문의함.
* 팝업창에 정보를 띄우기 위해서 Map에서 클릭한 정보와 mongoDB에 있는 정보를 비교하여 출력하려고 했지만
  Map unclustered된 한 지점을 누를 때 마우스의 미세한 이동에 따라 위도경도가 바뀌어서 불가하다는 것을 깨달았음.
* schema의 properties에 virtual메소드를 추가하려면 다음과 같이 옵션을 뒤에 추가해주어야 한다.
```js
const opts = { toJSON: { virtuals: true } };
const sampleSchema = new Schema({}, opts);
```

## Basic Security Issue Handle

* `express-mongo-sanitize` - sanitize query
* `helmet`
* `sanitize-html, Joi`
```js
const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
```

## Deploy
* `Atlas`
* `connect-mongodb-session`
* `connect-mongo`
* `heroku`

# 프로젝트 완료(배포) 후 고찰 및 어려웠던 점 나열
1. middleware는 굉장히 생소하게 다가왔기 때문에 error handling 부분이나 schema relationship
    부분에서 삭제시 연관된 하위 데이터들을 지우는 과정을 공부하는데 많은 시간을 들였다.
2. cloudinary와 mapbox등의 프레임워크를 사용하는 과정에서 직접 기술문서를 꼼꼼히 읽고 혼자서 새로운 컨텐츠들을 
    성공적으로 추가하였을 때 굉장히 기뻤다. 기술문서를 읽는 것이 중요하다는 것을 다시 한번 깨달았다.
3. 배포과정에서 가장 오류 수정을 많이 했다
  - connect-mongo의 사용방법 변화로 인한 착오
  - heroku 사용시 환경 변수들을 모두 heroku project안에서 config vars에 셋팅해야 했었다.
    (.env파일에만 쓰는 것은 무의미했음) => heroku 사이트에서 입력 혹은 cli환경에서 heroku config:set SECRET='~~'를 통해 입력 가능했다.
  - 배포 후 pc에서의 점검 후 이상이 없음을 판단하였지만, 모바일에서 지도가 나타나지않았다.
    - 각종 커뮤니티나 질문들을 찾아보면서 mapbox의 고질적인 문제이고 android사용자에게는 이러한 문제가 나타나지 않는다는 것을 알게 되었다.
    - 하지만 이는 mapbox 자체의 컨텐츠 보안 정책 (CSP)에 관한 docs에서 확인 가능하였고 helmet의 CSP옵션에서 childSrc를 blob으로 설정하였더니
      정상 작동했다. (mapbox는 동해와 일본해를 동시에 표기했던 것부터 별로 마음에 들지 않았다...)
4. 고찰(프로젝트기간)
  - 처음으로 프론트엔드 백엔드를 겸하여 프로젝트를 진행하여서 매우 뜻깊고 뿌듯했다. 물론 프론트나 백 둘다 완성도가 높은 것은 아니었지만, 이전까지는
    프론트엔드 프로젝트라면 눈으로 보여지는 하나의 그림같기만 했고, 제대로 된 백엔드 기술은 전혀 구사하지 못했는데, 이번 기회를 통해서 풀스택으로 
    성장할 수 있는 한단계 발판이 되지 않았나 싶다. 웹 풀스택을 향해 매일 공부하는 내가 되어야겠다.
