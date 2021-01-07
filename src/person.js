// 定義類別, 第一個字母大寫
class Person {
  // 函式用constructor來定義
  constructor(name = "noname", age = 20) {
    this.name = name;
    this.age = age;
  }
  toJSON() {
    return {
      name: this.name,
      age: this.age,
    };
    // return JSON.stringify({
    //   name: this.name,
    //   age: this.age,
    // });
  }
  // 雖然也可以用箭頭函式, 但還是習慣用print123(){return 123}這種方式
  print123 = () => 123;
}

module.exports = Person;
