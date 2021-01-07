// cmd > node src\fun.js

const f1 = a =>a*a;
const f2 = a =>{
    // {}內沒特別用return就不會回傳結果
    // return a*a 
    a*a
};

// console.log(f1(3))拿到9
console.log(f1(3));
// console.log(f2(3));會顯示undefined
console.log(f2(3));
