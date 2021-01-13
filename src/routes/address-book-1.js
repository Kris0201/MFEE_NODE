// 記得除了node要開啟server, mysql的server也要開啟
// 只提供一種輸出的做法

const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

router.get("/list", async (req, res) => {
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
    if (page < 1) {
      // page = 1; // 這樣也可以, 且兩者都可改成一行式的寫法
      return res.redirect("/address-book/list");
    }

    if (page > totalPages) {
      // page = totalPages; // 這樣也可以, 且兩者都可改成一行式的寫法
      return res.redirect(`/address-book/list?page=${totalPages}`);
    }

    [
      rows,
    ] = await db.query(
      "SELECT * FROM `address_book` ORDER BY `sid` DESC LIMIT ?, ?",
      [(page - 1) * perPage, perPage]
    );
  }

  res.render("address-book/list", {
    perPage,
    totalRows,
    totalPages,
    page,
    rows,
  });
  // res.json({
  //   perPage,
  //   totalRows,
  //   totalPages,
  //   page,
  //   rows,
  // });
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
