require("dotenv").config();
console.log(process.env.MY_USER);
console.log(process.env);



// 載入環境變數
// 放在根目錄的.env檔
// 通常不將.env上傳git, 因內部通常用於存放比較敏感的資料, 如帳號密碼等
// require("dotenv").config(); 使用此一套件搭配.env檔可方便管理與套用環境設定