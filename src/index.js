// 透過模組導入環境設定檔.env
require("dotenv").config();

const express = require("express");
// session處理
const session = require("express-session");
// 使用express-mysql-session提供的方法
// https://www.npmjs.com/package/express-mysql-session
const MysqlStore = require("express-mysql-session")(session);
// cors模組, 處理不同server的請求 https://www.npmjs.com/package/cors
const cors = require("cors");

// 擷取內容?????
const axios = require("axios");

// 類似JQ
const cheerio = require("cheerio");

// jsonwebtoken
const jwt = require("jsonwebtoken");

// 引用moment-timezone來處理時間格式
const moment = require("moment-timezone");

// multer處理上傳檔案
const multer = require("multer");
// const upload = multer({ dest:'tmp_uploads/'});
// 自訂上傳js
const upload = require(__dirname + "/modules/upload-imgs");

// 導入資料庫連線的js檔
const db = require(__dirname + "/modules/db_connect2");
// 使用SQL的資料庫做sessionStore
const sessionStore = new MysqlStore({}, db);

const app = express();

// 註冊樣版引擎, 記得在根目錄建立views資料夾, 除了安裝npm ejs套件, vscode也要裝EJS language support
app.set("view engine", "ejs");

// 將public資料夾的內容當作根目錄一樣讓外部讀取, 通常裡面放html, css, js, img等不需要再經過資料庫處理的靜態資料
app.use(express.static("public"));

// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
// 其包含兩種解析功能： urlencoded 和 json 。
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    // secret: "加密用字串",
    secret: "fghhuhudfhuidifasd",
    // saveUninitialized: 初始化儲存,
    saveUninitialized: false,
    resave: false,
    // 給SQL存session用, 超過設定時間也會自己清除, 但因為要連SQL所以效能略差, 但好處是server重啟不會消失
    store: sessionStore,
    cookie: {
      // maxAge: 1000 為1秒,
      maxAge: 1800000,
    },
  })
);

// 白名單的做法
// const whitelist = ['http://localhost:8080', undefined, 'http://localhost:3000'];
// const corsOptions = {
//   credentials: true,
//   origin: function (origin, cb) {
//     // console.log("origin:", origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   },
// };

// 全部允許
const corsOptions = {
  credentials: true,
  origin: function (origin, cb) {
    // console.log("origin:", origin);
    cb(null, true);
  },
};

// 沒設定直接允許不同server端的請求, 如沒有這段則不同server無法互通資料
app.use(cors(corsOptions));

// middle well
app.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl;
  res.locals.url = req.url;
  // 把req.session存到res.locals.sess 方便判斷有沒有登入
  res.locals.sess = req.session;
  next();
});

// 首頁
app.get("/", (req, res) => {
  res.render("a", { name: "現在暫時是首頁" });
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
  });
});

// 處理上傳檔案, 多個array()
// 利用postman測試, body > form-data > key:photo
app.post("/try-upload2", upload.array("photo"), (req, res) => {
  // req.files 會拿到多個上傳的資料物件
  res.json(req.files);
});

// 取得query parameters, 如缺值則失聯
app.get("/my-params1/:action/:id", (req, res) => {
  req.params.second = true;
  res.json(req.params);
});

// 取得query parameters, 如有?但缺值仍可送出
app.get("/my-params2/:action?/:id?", (req, res) => {
  req.params.first = true;
  res.json(req.params);
});

// regular expression 使用正規表達式限制url輸入的數值
// ex: m/0978-546-952 符合
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.slice(3);
  u = u.split("?")[0]; // query string 的部份不要
  u = u.split("-").join("");
  // u = u.replace(/-/g, '') // 用replace() 切與接
  res.send(u);
});

// 路由模組化
// 完整的rout應包含有req.baseUrl, 如果只取req.url則只有後面
// '/'跟沒有是一樣的
app.use("/baseUrlIsHere", require(__dirname + "/routes/admin2"));
app.use("/", require(__dirname + "/routes/admin2"));

// 測試session
app.get("/try-session", (req, res) => {
  req.session.my_var = req.session.my_var || 0;
  req.session.my_var++;

  res.json({
    my_var: req.session.my_var,
    session: req.session,
  });
});

// 測試處理時間格式
app.get("/try-moment", (req, res) => {
  // const fm = 'YYYY-MM-DD HH:mm:ss'; 符合SQL格式
  // https://momentjs.com/docs/#/displaying/
  const fm = "YYYY-MM-DD HH:mm:ss";
  const m1 = moment();
  // 如果送出的時間字串不是標準格式, 需要給他判斷的格式
  // 不存在的日期會顯示 "Invalid date"
  const m2 = moment("07/07/20", "MM/DD/YY");
  const m3 = moment("02/30/20", "MM/DD/YY");

  // moment("not a real date").isValid(); 判斷是否是合法的日期格式// false

  res.json({
    m1Format: m1.format(fm),
    m1Timezone: m1.tz("Europe/London").format(fm),
    m2Format: m2.format(fm),
    m2Timezone: m2.tz("Europe/London").format(fm),
    m3Format: m3.format(fm),
    m3Timezone: m3.tz("Europe/London").format(fm),
    m2IsValid: m2.isValid(),
    m3IsValid: m3.isValid(),
  });
});

// app.get("/try-db", (req, res) => {
//   // db.query("SQL語法").then() 因為是個promise所以可以用.then()
//   // https://www.npmjs.com/package/mysql2#using-promise-wrapper
//   // 拿到的是個陣列[rows, fields], 從資料庫拿到的資料會在rows裡, 一般不會使用fields, 甚至可以不設定只寫[rows]即可
//     db.query("SELECT * FROM `address_book` ORDER BY `sid` DESC LIMIT 6").then(
//     ([rows, fields]) => {
//       res.json(rows);
//     }
//   );
// });

// 改成async await , 方便做迴圈處理
app.get("/try-db", async (req, res) => {
  // https://www.npmjs.com/package/mysql2#using-promise-wrapper
  // 拿到的是個陣列[rows, fields], 從資料庫拿到的資料會在rows裡, 一般不會使用fields, 甚至可以不設定只寫[rows]即可
  const [rows] = await db.query(
    "SELECT * FROM `address_book` ORDER BY `sid` DESC LIMIT 6"
  );
  res.json(rows);
});

// 通訊錄模組
app.use("/address-book", require(__dirname + "/routes/address-book"));

// 登入畫面
app.get("/login", async (req, res) => {
  res.render("login");
});

// 接收登入
app.post("/login", upload.none(), async (req, res) => {
  const [
    rows,
  ] = await db.query(
    "SELECT * FROM `admins` WHERE `account` = ? AND `password` =  SHA1(?)",
    [req.body.account, req.body.password]
  );

  if (rows.length === 1) {
    req.session.admin = rows[0];
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
      body: req.body,
    });
  }
});

// 登入建立jsonwebtoken
// 用request.rest測試
// https://www.npmjs.com/package/jsonwebtoken
app.post("/login-jwt", async (req, res) => {
  const [
    rows,
  ] = await db.query(
    "SELECT * FROM `admins` WHERE `account` = ? AND `password` =  SHA1(?)",
    [req.body.account, req.body.password]
  );

  if (rows.length === 1) {
    // jwt.sign()建立token
    // const token = jwt.sign(物件, 加密字串);
    const token = jwt.sign({ ...rows[0] }, process.env.JWT_KEY);
    res.json({
      success: true,
      token,
    });
  } else {
    res.json({
      success: false,
      body: req.body,
    });
  }
});

// JWT驗證
// 用request.rest測試
app.post('/verify-jwt', async (req, res) => {
  // jwt.verify()驗證token
  jwt.verify(req.body.token, process.env.JWT_KEY, (error, payload) => {
    if (error) {
      res.json({ error });
    } else {
      res.json(payload);
    }
  });
});

// JWT驗證
// 用request.rest測試
// 將token放在header
// https://bitbucket.org/lsd0125/mfee09-nodejs/src/b048607a7de353e58e5e45f12c83763bc0d9184a/public/set_jwt_token.html
app.post('/verify2-jwt', async (req, res) => {
  let token = req.get('Authorization');
  if (token.indexOf('Bearer ') === 0) {
    token = token.slice(7);
    jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
      if (error) {
        res.json({ error });
      } else {
        res.json(payload);
      }
    })
  } else {
    res.json({ error: 'bad bearer token' });
  }
});

// 登出
app.get("/logout", (req, res) => {
  delete req.session.admin;
  res.redirect("/");
});

// 假的yahoo
// https://www.npmjs.com/package/axios
app.get("/fake-yahoo", async (req, res) => {
  const response = await axios.get("https://tw.yahoo.com/");
  res.send(response.data);
});

// 透過cheerio去拿到html內的屬性值, 用法類似JQuery
// https://www.npmjs.com/package/cheerio
app.get("/fake-yahoo2", async (req, res) => {
  const response = await axios.get("https://tw.yahoo.com/");
  const $ = cheerio.load(response.data);

  $("img").each(function (i, el) {
    res.write(el.attribs.src + "\n");
  });
  res.end("");
});

// 這個要放最後, 不然會先被讀到
app.use((req, res) => {
  res.type("text/plain");
  res.status(404).send("有問題喔 找不到頁面");
});

// 拿到.env設定的的PORT, 如果沒有那就預設3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`port: ${port}`, new Date());
});
