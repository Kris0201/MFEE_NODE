const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  fs.promises
    .writeFile(__dirname + "/headers03.txt", JSON.stringify(req.headers))
    .then(() => {
      res.end("Ok, nice!");
    })
    .catch((error) => {
      res.end("Oh, something wrong. error:" + error);
    });
});

server.listen(3000);

// 透過server寫一隻.txt或.json, 並將req.header內的資料寫入
// fsPromises.writeFile(file, data[, options])
