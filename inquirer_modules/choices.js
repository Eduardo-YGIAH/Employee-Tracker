const inquirer = require("inquirer");
// const DB = require("../DB_Class");

const initialChoices = [
  new inquirer.Separator(" = SELCT AN OPTION = "),
  {
    name: "Create a new Department"
  },
  {
    name: "Create a new Role"
  },
  {
    name: "Add an Employee"
  },
  //   new inquirer.Separator(" = VIEW EXISTING = "),
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
  //   new inquirer.Separator(" = EDIT EXISTING ="),
  {
    name: "Update employee role"
  },
  {
    name: "Update employee manager"
  },
  new inquirer.Separator(" = END OF OPTIONS = ")
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

module.exports = initialChoices;
