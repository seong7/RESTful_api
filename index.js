const express = require('express');
const app = express();
const port = 3000;
let numOfConnection = 0;

app.use("/res/", express.static("./public/"));

app.get("/", (req, res) => {
    console.log(typeof express.static("./public"));
    console.log("inbound connection detected");
    numOfConnection++;
    res.send(`Hello World !!</br>
    port : ${port}</br>
    <strong>${numOfConnection}th</strong> connection`);
})


app.listen(port, () => {
    console.log(`application is listening on port ${port}...`);
}) 