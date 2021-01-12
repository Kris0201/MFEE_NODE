const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../modules/db_connect2");

router.get("/list", async (req, res) => {
  // 每頁幾筆
  const perPage = 10;

  // 總共有幾筆
  const [t_rows] = await db.query("SELECT COUNT(1) num FROM `address_book`");
  const totalRows = t_rows[0].num;

  // 總共有幾頁
  const totalPages = Math.ceil(totalRows / perPage);

  // 現在在第幾頁
  let page = parseInt(req.query.page) || 1;

  // 取出資料
  const [
    rows,
  ] = await db.query(
    "SELECT * FROM `address_book` ORDER BY `sid` DESC LIMIT ?, ?",
    [(page - 1) * perPage, perPage]
  );

  res.json({
    perPage,
    totalRows,
    totalPages,
    page,
    rows,
  });
  // res.render("address-book/list", { rows });
});

module.exports = router;
