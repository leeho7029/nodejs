//한 개의 레코드 가져오기 연습(select One)
const dbCon = require("./mariaDBConn");
const express = require("express");
const app = express();
dbCon.getSample(3)
    .then((row) => {
        console.log(row);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });
let port = 4000;
app.listen(port, () => {
    console.log(`Sever Starting on ${port}`);
});