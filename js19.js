var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path'); 

var template = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: lightgray;
        }        
        #background {
            background-color: white;
            height: auto;
            width: 90%;
            max-width: 450px;
            box-shadow: 0px 40px 30px -20px rgba(0, 0, 0, 0.3);
        }

        .titlebar {
            background-color: #F9F9F9;
            font-weight: 400;
            border: none; border-bottom: 1px solid #CCCCCC;
            padding: 18px;
        }        
        .content {
            padding: 20px;
            max-height: max-content;
        }

        .btncover {
            display: flex;
            padding: 20px 10px 10px 10px;
        }        
        .btn {
            font-size: 15px;
            text-decoration: none;
            text-align: center;
            background-color: white;
            color: black;
            border: 1px solid lightgray;
            padding: 5px 10px;
            margin: 5px;
            display: inline-block;
            cursor: pointer;
            border-radius: 3px;
        }
      </style>
    </head>
    <body>
      <h2><a href="/" style="color:black; text-decoration: none; text-align: center;">Node.js 게시판 구현</a></h2>

      <div id="background">
        <div class="titlebar">글 목록</button></div>
        <div class="content">
            ${list}
        </div>
        <div class="titlebar">글 내용</button></div>
        <div class="content">
            ${body}
            ${control}
        </div>
      </div>
      
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<div class="btncover"><a class="btn" href="/create">글 작성</a></div>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <div class="btncover">
                <a class="btn" href="/create">글 작성</a>
                <a class="btn" href="/update?id=${title}">글 수정</a>
                <form action="/delete_pro" method="post" style="display: inline; padding 9px;">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="삭제" class="btn">
                </form>
                </div>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
            <form action="/create_pro" method="post" style="padding:10px; display:flex; flex-direction: column;">
                <p>제목</p>
                <input type="text" name="title" placeholder="title" class="textinput">
                <p>내용</p>
                <textarea name="description" placeholder="description" class="textinput" rows="5"></textarea><br>
                <input type="submit" value="완료" class="btn">
            </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_pro'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){        
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_pro" method="post" style="padding:10px; display:flex; flex-direction: column;">
              <input type="hidden" name="id" value="${title}">  
              <p>제목</p>
              <input type="text" name="title" placeholder="title" value="${title}" class="textinput">
              <p>내용</p>
              <textarea name="description" placeholder="description" class="textinput" rows="5">${description}</textarea><br>              
              <input type="submit" value="완료" class="btn">              
            </form>
            `,
            `<div class="btncover">
            <a class="btn" href="/create">글 작성</a>
            <a class="btn" href="/update?id=${title}">글 수정</a></div>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_pro'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_pro'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`}); 
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);