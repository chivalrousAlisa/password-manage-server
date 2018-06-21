const http = require('http');
const url = require('url');
const fs = require('fs');
const server = http.createServer((req,res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  var pathname = url.parse(req.url).pathname.substring(1);
  fs.readFile(pathname,(err,data) => {
    if(err){
      res.writeHead(404,{
        'Content-Type':'text/html'
      });
    } else {
      res.writeHead(200,{
        'Content-Type':'text/html'
      });
      res.write(data.toString());
    }
    res.end();
  });
}).listen(7000, '127.0.0.1', () => {
  console.log("http:127.0.0.1:7000");
});
