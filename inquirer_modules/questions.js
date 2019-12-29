// const inquirer = require("inquirer");

//FUNCTION TO VALIDATE NUMBERS
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

//CLASSES FOR QUESTIONS BY TYPE
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

// exports.initial_question = [new ListQuestion("initial_question", "What would you like to do?", initialChoices)];
// [
//   {
//     type: "list",
//     message: "What would you like to do?",
//     name: "initial_question",
//     choices: choices
//   }
// ];

// exports.department_name = {
//   type: "input",
//   name: "department_name",
//   message: "Give a name to the new Department.",
//   validate: function(answer) {
//     if (!answer) {
//       return `You need to provide a name to the Department.`;
//     }

//     return true;
//   }
// };

// exports.new_role = [
//   new InputTextQuestion("role_title", "Give a title to the new Role.", "You need to give a title to the role."),
// new InputNumberQuestion(
//   "role_salary",
//   "Set a salary to the new Role.",
//   "You need to provide an anual salary to the new Role as a decimal number. Note: £10,000.00 = 1000000"
// ),
//   new ListQuestion("role_department", "To what department does this role belongs to?", [
//     "option1",
//     "option2",
//     "option3"
//   ]);
// {
//   type: "input",
//   name: "role_title",
//   message: "Give a title to the new Role.",
//   validate: function(answer) {
//     if (!answer) {
//       return `You need to provide a title to the new Role.`;
//     }

//     return true;
//   }
// },

// {
//   type: "list",
//   name: "role_department",
//   message: "To what department does this role belongs to?",
//   choices: (async function currentDepartments() {
//     const currentDepartmentList = await DBModel.getDepartments();
//     return currentDepartmentList;
//   })(),
//   when: function(answer) {
//     return answer.role_salary;
//   },
//   validate: function(answer) {
//     if (!answer) {
//       return `You need to assign a department to the new Role.`;
//     }

//     return true;
//   }
// }

// module.exports = {
//   InputTextQuestion: InputTextQuestion,
//   InputNumberQuestion: InputNumberQuestion,
//   ListQuestion: ListQuestion
// };
