const express = require('express');
const app = express();
const port = 3000;
let numOfConnection = 0;

// app.use("")

app.get("/", (req, res) => {
    console.log("inbound connection detected");
    numOfConnection++;
    res.send(`Hello World !!</br>
              port : ${port}</br>
              todays : <strong>${numOfConnection}th</strong> connection`);
})

app.listen(port, () => {
    console.log(`application is listening on port ${port}...`);
})