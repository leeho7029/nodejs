const http = require('http');
let myName = "김기태";
let content = String.raw`<h2>${myName}</h2>`;
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
    res.end(content);
});
server.listen(3000);