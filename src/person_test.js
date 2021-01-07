const Person = require("./person");

// 使用時搭配new
const p1 = new Person();
const p2 = new Person("Peter", 29);

console.log(p1.toJSON());
console.log(p2.toJSON());

// 取得引用class的名稱
console.log(p2.constructor.name);
// 這個引用class的類型
console.log(typeof p2);
console.log(p2 instanceof Person);

console.log(p2.print123());