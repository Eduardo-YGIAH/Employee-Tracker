"use strict";
const inquirer = require("inquirer");
// const listOfDepartments = require("./server");

const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "HR_Request",
    choices: [
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
      new inquirer.Separator(" = EDIT EXISTING ="),
      {
        name: "Change Department name"
      },
      {
        name: "Change Role name"
      },
      {
        name: "Change Role from Employee"
      },
      {
        name: "Change Manager from Employee"
      },
      new inquirer.Separator(" = DELETE EXISTING = "),
      {
        name: "Delete Department"
      },
      {
        name: "Delete Role"
      },
      {
        name: "Delete Employee"
      }
    ]
  },
  {
    type: "input",
    name: "Department_Name",
    message: "Give a name to the new Department.",
    when: function(answer) {
      return answer.HR_Request === "Create a new Department";
    },
    validate: function(answer) {
      if (!answer) {
        return `You need to provide a name to the Department.`;
      }

      return true;
    }
  },
  {
    type: "input",
    name: "role_title",
    message: "Give a title to the new Role.",
    when: function(answer) {
      return answer.HR_Request === "Create a new Role";
    },
    validate: function(answer) {
      if (!answer) {
        return `You need to provide a title to the new Role.`;
      }

      return true;
    }
  },
  {
    type: "input",
    name: "role_salary",
    message: "Set a salary to the new Role.",
    when: function(answer) {
      return answer.role_title;
    },
    validate: function(answer) {
      if (!answer) {
        return `You need to provide a salary to the new Role.`;
      }

      return true;
    }
  }
  //   {
  //     type: "list",
  //     name: "role_department",
  //     message: "To what department does this role belongs to?",
  //     choices: listOfDepartments(),
  //     when: function(answer) {
  //       return answer.role_title;
  //     },
  //     validate: function(answer) {
  //       if (!answer) {
  //         return `You need to assign a department to the new Role.`;
  //       }

  //       return true;
  //     }
  //   }
];

module.exports = questions;
