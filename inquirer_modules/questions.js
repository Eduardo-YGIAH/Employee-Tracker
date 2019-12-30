const { isNumber } = require("../helper_functions");

//=======================
//CLASSES FOR QUESTIONS BY TYPE
//=======================
class InputTextQuestion {
  constructor(name, message, err) {
    this.type = "input";
    this.name = name;
    this.message = message;
    this.validate = answer => {
      if (!answer) {
        return err;
      }
      return true;
    };
  }
}

class InputNumberQuestion {
  constructor(name, message, err) {
    this.type = "input";
    this.name = name;
    this.message = message;
    this.validate = answer => {
      if (!isNumber(Number(answer)) || answer < 100000 || answer > 90000000) {
        return err;
      }
      return true;
    };
  }
}

class ListQuestion {
  constructor(name, message, choices, err = "not a valid input") {
    this.type = "list";
    this.name = name;
    this.message = message;
    this.choices = choices;
  }
}

module.exports = { InputTextQuestion, InputNumberQuestion, ListQuestion };
