require("dotenv").config();

const express = require("express");

// multer處理上傳檔案
const multer = require("multer");
// const upload = multer({ dest:'tmp_uploads/'});
// 自訂上傳js
const upload = require(__dirname + "/modules/upload-imgs");

const app = express();

// 註冊樣版引擎, 記得在根目錄建立views資料夾, 除了安裝npm ejs套件, vscode也要裝EJS language support
app.set("view engine", "ejs");

// 將public資料夾的內容當作根目錄一樣讓外部讀取, 通常裡面放html, css, js, img等不需要再經過資料庫處理的靜態資料
app.use(express.static("public"));

// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
// 其包含兩種解析功能： urlencoded 和 json 。
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("yahhhhh");
});

app.get("/try-ejs", (req, res) => {
  res.render("a", { name: "poe" });
});

// 在/json-sales的網址, 引用sales.json給變數sales, 套用json-sales.ejs的樣板並呈現json的內容
app.get("/json-sales", (req, res) => {
  const sales = require(__dirname + "/../data/sales.json");

  res.render("json-sales", { sales });
});

// 可以透過 req.query.名稱 取得，例如：req.query.a
app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

// 取得POST資料
// 透過POSTMAN測試, 將路由/try-post貼在POSTMAN, 在body的form-urlencode下輸入key與value, 完成再send
// const urlencodedParser = express.urlencoded({ extended: false });
// app.post("/try-post", urlencodedParser, (req, res) => {
//   // POST取得的資料在req.body
//   res.json(req.body);
// });

// 取得POST資料
// 測試1, 透過POSTMAN測試, 將路由/try-post貼在POSTMAN, 在body的form-urlencode下輸入key與value, 完成再send
// 測試2, 透過POSTMAN測試, 將路由/try-post貼在POSTMAN, 在body的raw下拉選單選JSON, 輸入JSON格式後, 完成再send
app.post("/try-post", (req, res) => {
  // POST取得的資料在req.body
  res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
});

app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

// app.post("/try-post-form", (req, res) => {
//   res.json(req.body);
// });

app.get("/pending", (req, res) => {
  res.send("傳統Ajax測試");
});

// 處理上傳檔案, 單個single(), 多個array(), 複雜fields(), 寫法不同
// 參閱 https://www.npmjs.com/package/multer
// 利用postman測試, body > form-data > key:avatar
app.post("/try-upload", upload.single("avatar"), (req, res) => {
  // req.file 會拿到上傳的資料物件
  res.json({
    file: req.file,
    body: req.body,
  })
});

// 處理上傳檔案, 多個array()
// 利用postman測試, body > form-data > key:photo
app.post("/try-upload2", upload.array("photo"), (req, res) => {
  // req.files 會拿到多個上傳的資料物件
  res.json(req.files);
});

app.use((req, res) => {
  res.type("text/plain");
  res.status(404).send("有問題喔 找不到頁面");
});

// 拿到.env設定的的PORT, 如果沒有那就預設3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`port: ${port}`, new Date());
});
