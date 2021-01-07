const Person = require("./person");

// 定義一個新的類別, 繼承一個已定義的類別, 並增加新東西
class Employee extends Person {
  constructor(employee_id, name = "noname", age = 20) {
    // super()拿父類別已定義過的變數
    super(name, age);
    
    this.employee_id = employee_id;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
  // 覆蓋原先已定義的toJSON()功能
  toJSON() {
    const obj = super.toJSON();
    obj.employee_id = this.employee_id;
    return obj;
  }
}

module.exports = Employee;
