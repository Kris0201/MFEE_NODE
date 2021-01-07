// 輸出單個function
// const f1 = (a) => a * a;

// console.log(f1(3));

// // 匯出funtion, 如要匯出多個funtion, 可將它做成物件
// module.exports = f1;

// 輸出多個function
const f1 = (a) => a * a;
const f2 = (a) => a * a * a;

console.log(f1(3));

// 匯出funtion, 如要匯出多個funtion, 可將它做成物件
module.exports = { f1, f2 };
