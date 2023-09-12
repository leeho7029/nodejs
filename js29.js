const dbCon = require("./mariaDBConn");
const express = require("express");
const app = express();      //delete from sample where no=?
dbCon.delSample(5)
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