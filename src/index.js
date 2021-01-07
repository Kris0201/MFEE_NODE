require("dotenv").config();

const express = require("express");

const app = express();

// 註冊樣版引擎, 記得在根目錄建立views資料夾
app.set("view engine", "ejs");

// 將public資料夾的內容當作根目錄一樣讓外部讀取, 通常裡面放html, css, js, img等不需要再經過資料庫處理的靜態資料
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("yahhhhh");
});

app.get('/try-ejs', (req, res)=>{
  res.render('a', {name:'poe'})
})

app.use((req, res) => {
  res.type("text/plain");
  res.status(404).send("有問題喔 找不到頁面");
});

// 拿到.env設定的的PORT, 如果沒有那就預設3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`port: ${port}`);
});
