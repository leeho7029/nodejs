//body-parser 설치 : npm install body-parser
const http = require('http');
const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
app.use(bodyPaser.urlencoded({extended: false}));
const server = http.createServer(app);
const PORT = 4000;

let users = [
    {id:"kim", pw:"1234"},
    {id:"lee", pw:"4321"},
    {id:"park", pw:"7979"},
];
//회원의 가입여부 확인(인덱스 반환) 함수
const findUserIndex = (id) => {     //findUserIndex("park") -> 2
    let index = -1;
    let len = users.length;
    for(let i=0;i < len; i++){
        if(users[i].id === id){
            index = i;
            break;
        }
    }
    return index;
};

//회원가입 함수
const register = (id, pw) => {  //register("choi", "2424")
    let index = findUserIndex(id);
    if (index !== -1) return false;
    users.push({id, pw});   //객체 배열 추가 => 자동 회원 가입
    return true;
};
//로그인 처리 함수
const login = (id, pw) => {
    let index = findUserIndex(id);
    if (index === -1) return false; //로그인 실패-없는 아이디인 경우
    if(users[index].id === id && users[index].pw === pw) return true;
    return false;   //로그인 실패-비밀번호가 맞는 않는 경우
};
//비밀번호 변경
const changePw = (id, pw) => {
    let index = findUserIndex(id);
    if (index === -1) return false;
    users[index].pw = pw;
    return true;
};
//회원 탈퇴
const deleteUser = (id) => {
    let index = findUserIndex(id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
};
//정보 입력(Insert)
app.post("/", (req, res) => {   //폼 전송(body)
    let id = req.body.id;
    let pw = req.body.pw;
    if(!register(id, pw)) return res.status(401).send("중복된 아이디 입니다.");
    res.send("회원 가입을 축하합니다.");
});
//정보 조회(selectOne)
app.get("/:id", (req, res) => { //GET => param
    let id = req.params.id
    if(findUserIndex(id) === -1) return res.status(401).send("해당 회원이 존재하지 않습니다.");
    res.send(`안녕하세요 ${id}님~!`);
});
//정보 변경(Update)
app.put("/:id",(req, res) => {
    let id = req.params.id;
    let pw = req.body.pw;
    if(!changePw(id, pw)) return res.status(401).send("비밀번호 변경 실패");
    res.send(`${id}님의 비밀번호가 성공적으로 변경되었습니다.`);
});
//회원 탈퇴(delete)
app.delete("/:id", (req, res) => {
    let id = req.params.id;
    if(!deleteUser(id)) return res.status(401).send("회원 탈퇴 실패");
    res.send("회원 탈퇴 성공");
});
//
app.post("/login", (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    if(!login(id, pw)) return res.status(401).send("로그인 실패");
    res.send(`${id}님 로그인 성공`);
});
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//post man test
//New -> HTTP -> 
//GET : http://localhost:4000/kim
//POST : http://localhost:4000          key:id=jeong, pw=3214
//PUT : http://localhost:4000/kim       key:pw=7979
//DELETE : http://localhost:4000/kim