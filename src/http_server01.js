const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=UTF-8",
  });
  res.end(`
    <h2>Hi, welcome to this easy server.</h2>
    <h2>歡迎來到這個簡易的伺服器.</h2>
    <p>${req.url}</p>
  `);
});

server.listen(3000);

// 注意在執行的時候使用cmd, 避免使用powershell, 有部分執行上不相容
// 同一個埠號不能被重複執行
// 直接在cmd執行server > node src\http_server01.js 有任何修改都必須重啟server
// 在cmd透過ndoemon套件執行server > nodemon src\http_server01.js , 修改後不須重啟server, 刷新網頁即可, 適合在開發時使用
// npm i -g nodemon
// 在cmd透過pm2套件執行server > pm2 start src\http_server01.js , 適合server正式上線時使用, 有更細部的指令
// npm i -g pm2

