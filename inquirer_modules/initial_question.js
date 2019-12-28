const inquirer = require("inquirer");

const choices = [
  new inquirer.Separator(" = CREATE NEW = "),
  {
    name: "Create a new Department"
  },
  {
    name: "Create a new Role"
  },
  {
    name: "Add an Employee"
  },
  new inquirer.Separator(" = VIEW EXISTING = "),
  {
    name: "View Departments"
  },
  {
    name: "View Roles"
  },
  {
    name: "View Employees"
  },
  {
    name: "View Employees by Manager"
  },
  {
    name: "View the total utilized budget by department"
  },
  new inquirer.Separator(" = EDIT EXISTING ="),
  {
    name: "Update employee role"
  },
  {
    name: "Update employee manager"
  }
  // new inquirer.Separator(" = DELETE EXISTING = "),
  // {
  //   name: "Delete Department"
  // },
  // {
  //   name: "Delete Role"
  // },
  // {
  //   name: "Delete Employee"
  // }
];

const initial_question = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "hr_request",
    choices: choices
  }
];

module.exports = initial_question;
