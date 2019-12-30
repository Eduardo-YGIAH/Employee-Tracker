const inquirer = require("inquirer");

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
  {
    name: "Update employee role"
  },
  {
    name: "Update employee manager"
  },
  {
    name: "Delete Department"
  },
  {
    name: "Delete Role"
  },
  {
    name: "Delete Employee"
  },
  new inquirer.Separator(" = END OF OPTIONS = ")
];

module.exports = initialChoices;
