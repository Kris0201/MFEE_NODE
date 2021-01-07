// cmd > node src\employee_test.js

const Employee = require("./employee");

const em = new Employee("9527", "唐伯虎", 29);

console.log("" + em); // 其實等於console.log(em.toString());
console.log(em.toJSON());
console.log(em.toString());

