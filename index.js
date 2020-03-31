const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use("/res/", express.static("./public/"));

app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.send("Hello World");
    // res.send(res.header);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Application is listening on port ${port}...`);
});