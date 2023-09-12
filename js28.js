//update문 연습
const dbCon = require("./mariaDBConn");
const express = require("express");
const app = express();
let sample = ["강감찬", 6]; //update sample set name=? where no=?
dbCon.editSample(sample)
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