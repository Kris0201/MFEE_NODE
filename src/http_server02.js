const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  fs.writeFile(
    __dirname + "/headers02.txt",
    JSON.stringify(req.headers),
    (error) => {
      if (!error) {
        res.end("Ok, nice!");
      } else {
        res.end("Oh, something wrong. error:" + error);
      }
    }
  );
});

server.listen(3000);

// 透過server寫一隻.txt或.json, 當連上server時產生.txt或.json, 並將req.header內的資料寫入
// fs.writeFile(file, data[, options], callback)
