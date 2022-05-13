# Campground

### Intro.

---

프로 캠핑러들을 위한 캠핑 장소 정보 공유 및 리뷰 사이트

### Deployment

---

[Campground](https://campground-heroku.herokuapp.com/)

### GitHub Repository

---

[GitHub - dongjji/Campground: 🏕Camper Recruitment Website of Campround⛺️](https://github.com/dongjji/Campground)

### Implementation &  Framework

---

- SSR: `nodejs` & `express` & `ejs`
- DB: `MongoDB Atlas` & `mongoose`
- MVC: Model, View, Controller & Router
- REST API: `method-override`

### Function & Skill Stack

---

- 회원가입 & 로그인 & 로그아웃(`passportjs` & `cookie & session`)
- 플래쉬 메시지(`connect-flash`)
- 인증(Authentication)과 권한(Authorization)
- 게시물 작성 편집 수정
- 입력 유효성 검사(`Joi`)
- 게시물 댓글 및 평점 기능
- 이미지 업로드, 표시 및 삭제(`Cloudinary` & `multer`)
- 지도 및 정보 표시(`Mapbox`)
- 보안 설정(`Mongo-Sanitizer`, `Helmet`)
- 배포(`Heroku`)

---

# 프로젝트 완료(배포) 후 고찰 및 어려웠던 점 나열

1. middleware는 굉장히 생소하게 다가왔기 때문에 error handling 부분이나 schema relationship
부분에서 삭제시 연관된 하위 데이터들을 지우는 과정을 공부하는데 많은 시간을 들였다.
2. `cloudinary`와 `mapbox`등의 프레임워크를 사용하는 과정에서 직접 기술문서를 꼼꼼히 읽고 혼자서 새로운 컨텐츠들을 성공적으로 추가하였을 때 굉장히 기뻤다. 기술문서를 읽는 것이 중요하다는 것을 다시 한번 깨달았다.
3. 배포과정에서 가장 오류 수정을 많이 했다
    - `connect-mongo`의 사용방법 변화로 인한 착오
    - `heroku` 사용시 환경 변수들을 모두 heroku project안에서 config vars에 셋팅해야 했었다.
    (.env파일에만 쓰는 것은 무의미했음) => heroku 사이트에서 입력 혹은 cli환경에서 heroku config:set SECRET='~~'를 통해 입력 가능했다.
    - 배포 후 pc에서의 점검 후 이상이 없음을 판단하였지만, 모바일에서 지도가 나타나지않았다.
        - 각종 커뮤니티나 질문들을 찾아보면서 mapbox의 고질적인 문제이고 android사용자에게는 이러한 문제가 나타나지 않는다는 것을 알게 되었다.
        - 하지만 이는 `mapbox` 자체의 컨텐츠 보안 정책 (CSP)에 관한 docs에서 확인 가능하였고 `helmet`의 CSP옵션에서 childSrc를 blob으로 설정하였더니 정상 작동했다.
4. 고찰(프로젝트기간)
    
    처음으로 프론트엔드 백엔드를 겸하여 프로젝트를 진행하여서 매우 뜻깊고 뿌듯했다. 물론 프론트나 백 둘다 완성도가 높은 것은 아니었지만, 이전까지는 프론트엔드 프로젝트라면 눈으로 보여지는 하나의 그림같기만 했고, 제대로 된 백엔드 기술은 전혀 구사하지 못했는데, 이번 기회를 통해서 풀스택으로
    성장할 수 있는 한단계 발판이 되지 않았나 싶다. 웹 풀스택을 향해 매일 공부하는 내가 되어야겠다.
