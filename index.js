const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser"); // post 방식 사용하기 위한 라이브러리
const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const port = 3000;
app.listen(port, () => {
  console.log(`Application is listening on port ${port}...`);
});

app.use("/res/", express.static("./public/"));
// app.use("/", express.static("./"));
app.use("/error/404", express.static("./404"));
app.use("/error/500", express.static("./500"));

/*******/
/* GET */
/*******/
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  res.send({
    test: "tt"
  });
});

app.get("/get/:testKey", (req, res) => {
  console.log("에러발생전"); // __ 출력
  // null.jj; // 해당 middle ware 빠져나가 err middle ware 를 찾으러 감
  console.log("에러발생후"); // __ 출력 X

  console.log(" '/' GET 요청 받음");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  // res.send(res.getHeaders()); // res 의 header 정보 json 으로 응답함
  const data = req.query;
  if (data.id === "aa" && data.pwd === "123") {
    res.send([
      "GET _ 로그인 완료",
      req.headers["content-type"], // null _ GET 방식에는 content-type 없음?
      req.headers,
      req.body, // null 임
      req.query, // get 방식으므로 query 로 받음
      req.params, // url 로 넘어오는 값 따로 받음..?
      res.getHeaders()
    ]);
  } else {
    res.send(["GET _ 로그인 실패", req.query, req.headers["content-type"]]);
  }
  // res.send(req.query); // get 방식에서 req 내용을 받는 property
});

app.get("/simple/:num/:name", (req, res) => {
  // RESTful API 규칙에 더 부합하게 설계 가능한 방식
  // res.send(req.params);
  res.send(req.query);
  // res.send(req.params.name);
});

/*


http://

blog.naver.com:80
13.209.97.166

/post/test/vvv/?id=aa&pwd=123


app.get("/test/:a/:b", (req, res) => {
    // http://13.209.97.166/test/1/2?c=3&d=4
    res.send({
        params: req.params,
        query: req.query,
    })
    // 결과 :
    // {
    //     "params": {
    //     "a": "1",
    //     "b": "2"
    //     },
    //     "query": {
    //     "c": "3",
    //     "d": "4"
    //     }
    //  }

    // params 와 query 는 별게
});


*/

/********/
/* POST */
/********/
app.use(bodyParser.urlencoded({ extended: false }));
// x-www-form-urlencoded type 의 request body 대한 parsing
// 형태는 get 의 query string 과 비슷 (id=seongjinkim21&name=SeongjinKim)
app.use(bodyParser.json());
// application/json type 의 request body 대한 parsing

app.post("/post/:testKey/", (req, res) => {
  // let param = {
  //     testKey: 'test',
  //     make: 'vvv'
  // };

  // null.dd;
  console.log("'/' POST 요청 받음");
  // res.send(req.body); // post 방식에서 req 내용을 받는 property
  const data = req.body;
  if (data.id === "aa" && data.pwd === "123") {
    res.send([
      "POST _ 로그인 완료",
      req.headers["content-type"],
      req.headers,
      req.query, // 비어 있는 json (null 아님) 왜 ?? : !! POST 요청도 url 을 통해 GET 을 포함할 수 있음
      req.params, // url 로 넘어온 data 받음
      req.body, // post 이므로 body 에서 받음
      res.getHeaders()
    ]);
  } else {
    res.send([
      "POST _ 로그인 실패",
      req.body,
      req.params,
      req.query,
      req.headers["content-type"]
    ]);
  }
});

// // !!! 경로를 위에 못 찾으면 해당 use 실행 (404 로직과 일치함)
app.get('/render', (req, res, next) => {
//   // res.status(404).send('ABCDE_3');
//   // res.status(404).send("404");
//   if (false) {
//     fs.readFile(__dirname + "/404/index.html", (err, data) => {
//       console.log(process.pid);
//       // console.log(process);
//       // console.log(process.platform);
//       // console.log(filename);
//       // Global 변수들

//       //data.toString()
//       res.status(404).send(!err ? data.toString() : "404파일도없다"); //.redirect('/error/404'); // 하나만 보낼 수 있음
//     });
//   }
//   res.send('234234')
  res.render("page", {name:'홍길동', money:100});
});

// !!! error 가 발생하면 인자가 4개인 use (middle ware) 를 찾는다.
app.use((err, req, res, next) => {
    console.log(err);
  // res.status(600).send('2332')

  // res.send('234234');
  // res.status(500).redirect('./error/500'); // 하나만 보낼 수 있음
  res.status(500).redirect("/error/500"); // 하나만 보낼 수 있음
});

// app.get("/errorr", (req, res) => {
//     null.asdf;
// })
