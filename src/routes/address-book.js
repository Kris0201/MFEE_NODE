// 記得除了node要開啟server, mysql的server也要開啟
// 多功能的作法

const express = require("express");

// 檔案上傳用 記得注意路徑
// https://www.npmjs.com/package/multer#none
const upload = require(__dirname + "/../modules/upload-imgs");

const moment = require("moment-timezone");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

// 取得baseUrl與url, 將其放在locals
router.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl;
  res.locals.url = req.url;
  next();
});

const listHandler = async (req) => {
  // 每頁幾筆
  const perPage = 10;

  // 總共有幾筆
  // [t_rows] 拿到後會長這樣 [ [ TextRow { num: 239 } ] ]
  const [t_rows] = await db.query("SELECT COUNT(1) num FROM `address_book`");
  // console.log([t_rows]);
  const totalRows = t_rows[0].num;

  // 總共有幾頁
  // Math.ceil() 函式會回傳大於等於所給數字的最小整數。
  const totalPages = Math.ceil(totalRows / perPage);

  // 現在在第幾頁
  let page = parseInt(req.query.page) || 1;

  // 先做基本條件判斷, 再從mySQL取出資料
  // https://www.npmjs.com/package/mysql#preparing-queries
  let rows = [];
  if (totalRows > 0) {
    if (page < 1) page = 1;

    if (page > totalPages) page = totalPages;

    [
      rows,
    ] = await db.query(
      "SELECT * FROM `address_book` ORDER BY `sid` DESC LIMIT ?, ?",
      [(page - 1) * perPage, perPage]
    );

    rows.forEach((item) => {
      item.birthday = moment(item.birthday).format("YYYY-MM-DD");
      item.mobile = item.mobile.replace(/-/g, "");
    });
  }

  // 回傳物件
  return {
    perPage,
    totalRows,
    totalPages,
    page,
    rows,
  };
};

// 依照網址決定最後的功能走向
router.get("/:sid/edit", async (req, res) => {
  // 進到修改資料頁, 並且匯入對應的資料
  const [rows] = await db.query(
    "SELECT * FROM `address_book` WHERE `sid` = ? ",
    [req.params.sid]
  );
  // 如果沒有對應的資料, 導向表單頁面
  if (rows.length !== 1) {
    return res.redirect(res.locals.baseUrl + "/list");
  }
  // 處理日期格式
  rows[0].birthday = moment(rows[0].birthday).format("YYYY-MM-DD");
  res.render("address-book/edit", rows[0]);
});

router.post("/:sid/edit", upload.none(), async (req, res) => {
  // 得到單筆資料, 並修改他
  const { name, email, mobile, birthday, address } = req.body;
  const data = { name, email, mobile, birthday, address };

  const [
    result,
  ] = await db.query("UPDATE `address_book` SET ? WHERE `sid` = ? ", [
    data,
    req.params.sid,
  ]);
// affectedRows, changedRows

  res.json({
    ...result,
    success:result.changedRows===1
  });
});

router.delete("/:sid", async (req, res) => {
  // 如果前端還沒有畫面可以用POSTMAN先測試, 記得方法選DELETE
  // a連結預設是GET, 所以是連不進DELETE的, 需要靠JS的function去做fetch
  const [result] = await db.query(
    "DELETE FROM `address_book` WHERE `sid` = ? ",
    [req.params.sid]
  );
  // console.log(result);
  res.json({
    success: result.affectedRows === 1,
  });
});

router.get("/add", async (req, res) => {
  res.render("address-book/add");
});

router.post("/add", upload.none(), async (req, res) => {
  // 創造一個物件放post得到後要寫入sql的資料
  // const data = { ...req.body };
  // 只拿出要進SQL的資料
  const { name, email, mobile, birthday, address } = req.body;
  const data = { name, email, mobile, birthday, address };
  data.created_at = new Date();
  data.stars = 10;
  const [result] = await db.query("INSERT INTO `address_book` SET ?", [data]);
  console.log(result);

  // 除select以外的SQL語法大概都會拿到, 可用來判定有無處理這次的SQL語法
  // ResultSetHeader {
  //   fieldCount: 0,
  //   affectedRows: 1,
  //   insertId: 259,
  //   info: '',
  //   serverStatus: 2,
  //   warningStatus: 1
  // }

  // 如果有改success: true, 沒改success: false,
  if (result.affectedRows === 1) {
    res.json({
      success: true,
      body: req.body,
    });
  } else {
    res.json({
      success: false,
      body: req.body,
    });
  }
});

router.get("/list", async (req, res) => {
  const output = await listHandler(req);
  res.render("address-book/list", output);
});

router.get("/api/list", async (req, res) => {
  const output = await listHandler(req);
  res.json(output);
});

module.exports = router;

// rows 拿到後是個內含物件的陣列
// [
//   {
//     "sid": 257,
//     "name": "是在哈樓",
//     ...
//   },
//   {
//     "sid": 255,
//     "name": "百陳成",
//     ...
//   },
// ]
