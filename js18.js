const http = require('http');
const url = require('url');
const qs = require('querystring');
let tmp1 = `<!doctype html>
<html>
<head>
  <title>POST</title>
  <meta charset="utf-8">
</head>
<body>
  <form action="/post_test" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p><textarea name="description" placeholder="description"></textarea></p>
    <p><input type="submit"></p>
  </form>
</body>
</html>`;

const app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
        res.end(tmp1);
    } else if(pathname === '/post_test'){
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body);      //post.title
            var title = post.title;
            var description = post.description;
            res.end(`<!doctype html>
            <html>
            <head>
              <title>POST</title>
              <meta charset="utf-8">
            </head>
            <body>
                <div class="container">
                    <p>title : ${title }</p>
                    <p>description : ${description }</p>
                </div>
            </body>
            </html>
            `);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found Page');
    }
});
app.listen(3000);