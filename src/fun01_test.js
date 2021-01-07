// // require()取得單個function
// // 指定變數得到require()來源內,module.exports出來的function
// // 引用js會執行一次, 但重複引用只會指定功能但不會重複執行
// const getfun01 = require("./fun01");
// const getfun02 = require("./fun01");

// // module.exports的功能還是能指定給新變數, 但原js的執行並不會重覆再被執行
// console.log(getfun01(5));
// console.log(getfun02(6));

// require()取得多個function 方法1
const { f1, f2 } = require("./fun01");
// 或單獨
// const { f1 } = require("./fun01");
// const { f2 } = require("./fun01");

console.log(f1(2));
console.log(f2(2));

// require()取得多個function 方法2
const hahaha = require("./fun01");
console.log(hahaha.f1(2));
console.log(hahaha.f2(2));

// 結果為true
const yayaya = require("./fun01");
console.log(hahaha === yayaya);
