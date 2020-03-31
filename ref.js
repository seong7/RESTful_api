const stAsync = require('st-async') // 
const fs = require('fs') // 
const multer = require('multer') // multipart/form-data 를 위함 = 파일첨부
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;
const upload = multer({storage:multer.memoryStorage()});



let numOfConnection = 0;

 // use : get post put delete 를 모두 포함(어떤 접속이든 받을 수 있음)
app.use(bodyParser.urlencoded({ extended: false }));    // x-www-form-urlencoded type 의 request body 대한 parsing
                                                        // 형태는 get 의 query string 와 비슷 (id=seongjinkim21&name=SeongjinKim)
                                                        // HTML form method="post" 로 보낼 때 
app.use(bodyParser.json()); // application/json type 의 request body 대한 parsing

app.use("/res/", express.static("./public/"));


app.post("/upload", upload.single('aaaaa'), (req, res, next) => {
    console.log(req.file); // 첨부파일
    console.log(req.body); // 일반 값
    fs.writeFile('./public/testImg.jpeg', req.file.buffer, function (err){
        console.log(2); // 다음 출력
        if(err){
            res.send("fail");
        }else{
            res.send("success");
        }
    });   // 확장자는 linux 에게는 의미 없지만 사람이 보기 위해 기록
    console.log(1); // 먼저 출력
    // res.send('..')
});

app.get("/hello/:id/:pwd", (req, res) => {
    res.send(req.params); // .../hello?id=11&pwd=123  =>  .../hello/11/123 로 줄여줌  
                          // REST ful 규칙에 더 부합할 수 있게 설계 가능
});

app.get("/async", (req, res) => {
    let data = [];
    function make_promise(word) {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{console.log(word); resolve(word*10);}, 3000 * Math.random());
        })
    }    
    stAsync(
        o => { 
            setTimeout(()=>{
                data.push(o.data); // 12
                  o(o.data*2);
               },1000);

        },
        o => { 
            data.push(o.data); // 24
            o(o.data*2); // 48
        },
        stAsync.catch(error => {
            console.log(error);
        }),
        stAsync.finally(list => {
            res.send({
                data:data,
                list:list
            }); // [12, 24, 48]
        }),
    )
    

});


app.get("/back", (req, res) => {
  // console.log(typeof express.static("./public"));
  console.log("inbound connection detected");
  numOfConnection++;
  res.send(`Hello World !!</br>
    port : ${port}</br>
    <strong>${numOfConnection}th</strong> connection`);
});

app.get("/", (req, res) => {
    // null.sadfashdfklasdjkfh; // error 발생시키기

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // 위 두개를 추가해주면 다른 도메인에서도 해당 api 에 data 를 요청할 수 있음 (CORS 허용)
  // default 는 동일한 도메인에서만 가능.
  res.send("dd");
  // res.send(req.query); // 응답 값의 type 을 express 에서 자동으로 인식 -> 브라우저의 response headers.Content-type 에 설정됨
                // get data 받음
  
  // res.put("Server", "AAAAAA");
  // if(req.headers['user-agent'].indexOf('Windows NT') !== -1) {
    //     res.send('윈도우즈 사용자입니다'); // send 는 한번만 해줄 수 있음
    // } else {
    //     res.send('다른거 사용자입니다'); // send 는 한번만 해줄 수 있음
    // }
});

app.post("/", (req, res) => {
    res.send(req.body); // post data 받는 property
});

app.listen(port, () => {
  console.log(`application is listening on port ${port}...`);
});

app.use((req, res, next) =>{
    res.status(404).send('그런주소가 없습니다')
});

// app.use((req, res, next, err) =>{
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).send("서버에서 에러가 났습니다") 
});


if(false) {
    let app = {use(cb){
        console.log(cb.length);
    }};

    // 비동기 코드의 문제점 1 : 코드 진행 순서를 정할 수 없다.
        // 모두 background 에서 실행되므로, 1 -> 2 -> 3 과 같은 순차적인 실행을 시킬 수 없다. 
    if(false) {
        function asyncWork() {
            // 순서에 상관 없이 Math.random 에 의해 random 순서로 callback fn 이 실행된다.
            setTimeout(() => {console.log('첫번째');}, 3000 * Math.random());
            setTimeout(() => {console.log('두번째');}, 3000 * Math.random());
            setTimeout(() => {console.log('세번째');}, 3000 * Math.random());
        }
        asyncWork();
    }
    // 순서 문제를 극복한 코드
        // 하지만, callback hell 이 형성되어 가독성이 떨어짐 
    if(false) {
        function asyncWork() {
            setTimeout(() => {
                console.log('첫번째');
                setTimeout(() => {
                    console.log('두번째');
                    setTimeout(() => {
                        console.log('세번째');
                    }, 3000 * Math.random());
                }, 3000 * Math.random());
            }, 3000 * Math.random());
        }
        asyncWork();
    }
    // async / awiat , Promise 를 사용해 가독성 문제 완화
    // await 로 순서 문제를 극복(Promise 가 완료될 때까지 비동기 코드 진행을 대기함)
    // ** 중요 : Promise 는 반드시 resolve 또는 reject 함수를 호출해야함. 
                // resolve , reject 함수는 Promise 의 완료를 알려주는 역할을 한다.
                // 호출하지 않으면 await 는 해당 Promise 가 완료되지 않은 것으로 간주함 ( 다음 비동기 코드 진행 X )
    if(false) {
        async function asyncwork() {

            try {
                let result = await new Promise((resolve, reject)=>{
                    setTimeout(()=>{console.log('첫번째'); resolve('인자...');}, 3000 * Math.random());
                });
                await new Promise((resolve, reject)=>{
                    setTimeout(()=>{console.log('두번째'+result); resolve();}, 3000 * Math.random());
                });
                await new Promise((resolve, reject)=>{
                    setTimeout(()=>{console.log('세번째'); reject('reject의 이유...');}, 3000 * Math.random());
                });
                await new Promise((resolve, reject)=>{
                    setTimeout(()=>{console.log('네번째')}, 3000 * Math.random());
                });
            } catch(error) {
                console.log(error);
            } finally {
                console.log('무조건 실행');
            }
        }
        asyncwork() 
    }

    // ** alert() 사용하면 안되는 이유 :
    // 비동기 코드들 중간에 동기 코드인 alert 가 있으면 동기 코드가 종료 될 (alert 확인버튼 누를) 때까지 모든 비동기 코드 진행은 멈춘다.
    if(false) {
        async function asyncwork() {
            let result = await new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    console.log('첫번째'); 
                    resolve(' 매개변수');
                    /* alert 실행 */
                    alert(1);
                }, 3000 * Math.random());
            });
            await new Promise((resolve, reject)=>{
                setTimeout(()=>{console.log('두번째'+result); resolve();}, 3000 * Math.random());
            });
            await new Promise((resolve, reject)=>{
                setTimeout(()=>{console.log('세번째'); resolve('3번 종료');}, 3000 * Math.random());
            });
        }
        asyncwork() 
    }
        // 예 1) naver 의 뉴스와 실시간 검색어 list component 가 비동기적으로 계속 업데이트 되고 있을 때 console 에 alert(1) 을 하면 alert 창이
        //      사라질 때까지 모든 비동기 업데이트가 멈추는 것을 확인할 수 있다.
        // 예 2) nodejs 의 모든 코드는 비동기적으로 작동하도록 설계되어 있다.
        //      예를 들어, 파일을 서버에 업로드하는 코드가 동기적으로 실행되도록 설계되어 있다면
        //      파일 업로드가 끝날 때까지 서버가 중단되어 다른 사람들은 해당 웹싸이트에 접속조차 하지 못하게 된다.
        //      용량이 큰 파일은 업로드가 오래걸려 더 오래 중단될 것이다.

        // 그래서 node js 라이브러리들은 sync 를 구분해놓음
    
    // 공통된 작업을 하는 Promise 를 function 에 return 시켜 (변수에 저장됨) 가독성을 더 높인 코드
    if(false) {
        function make_promise(word) {
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{console.log(word); resolve(word*10);}, 3000 * Math.random());
            })
        }
        async function asyncwork() {
            try {
                result = await make_promise(1);
                result = await make_promise(result);
                result = await make_promise(result);
                result = await make_promise(result);
            } catch(error) {
                console.log(error);
            } finally {
                console.log('무조건 실행');
            }
        }
        asyncwork() 
    }

    // async function 을 호출 없이 즉시 실행하도록 만든 코드 (IIFE 형식)
    function make_promise(word) {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{console.log(word); resolve(word*10);}, 3000 * Math.random());
        })
    }
    (async function () {
        try {
            result = await make_promise(1);
            result = await make_promise(result);
            result = await make_promise(result);
            result = await make_promise(result);
        } catch(error) {
            console.log(error);
        } finally {
            console.log('무조건 실행');
        }
    })()


    try {
        console.log(1);
        console.log(2);
        console.log(3);
        null.asdfasdfasfd
        console.log(4);
        console.log(5);
    } catch(error) {
        console.log(error);
    } finally {
        console.log('무조건실행');
    }

// }}
}