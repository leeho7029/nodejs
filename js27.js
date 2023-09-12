//insert문 연습
const dbCon = require("./mariaDBConn");
const express = require("express");
const app = express();
let sample = {no:6, name:"오세훈"};
dbCon.addSample(sample)
    .then((msg) => {
        console.log(msg);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });
let port = 4000;
app.listen(port, () => {
    console.log(`Sever Starting on ${port}`);
});