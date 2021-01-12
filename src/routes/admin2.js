const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.box = "777";

  // next()會往下接get()或post()等其一
  next();
});

// router.get('/admin2/:p1?/:p2?', (req, res)=>{
//     res.json({
//         params: req.params,
//         url: req.url,
//         baseUrl: req.baseUrl,
//     })
// })

const handler1 = (req, res) => {
//   console.log(req);
  res.json({
    // req.params 會取得:p1與:p2的值, ?則代表可不填
    // req.url與req.baseUrl取得的字串不一樣
    params: req.params,
    url: req.url,
    baseUrl: req.baseUrl,
    // query:req.query,
    locals: res.locals,
  });
};

router.get("/admin2/:p1?/:p2?", handler1);
router.get("/admin2a/:p3?/:p4?", handler1);

module.exports = router;
