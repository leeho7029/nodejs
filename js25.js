//여러 레코드 가져오기 : selectList
const dbCon = require("./mariaDBConn");
const express = require("express");
const app = express();
dbCon.getSampleList()
    .then((rows) => {
        rows.map((tuple) => {  console.log(tuple);   });
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });
let port = 4000;
app.listen(port, () => {
    console.log(`Sever Starting on ${port}`);
});