const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
// const questions = require("./questions");
const consoleTable = require("console.table");
const Department = require("./hr_modules/department");
const Role = require("./hr_modules/role");
const DB = require("./DB_Class");

const port = process.env.PORT;

const app = express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "employee_tracker"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database");
  let DBModel = new DB(con);

  (async function initializeInquirer() {
    let currentDepartments = await DBModel.getDepartments();
    let currentRoles = await DBModel.getRoles();
    let currentEmployees = await DBModel.getEmployees();
    console.log(currentDepartments);
    console.log(currentRoles);
    console.log(currentEmployees);
    inquirer
      .prompt([
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
        },
        {
          type: "list",
          name: "role_department",
          message: "To what department does this role belongs to?",
          choices: currentDepartments,
          when: function(answer) {
            return answer.role_title;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to assign a department to the new Role.`;
            }

            return true;
          }
        }
      ])
      .then(answer => {
        if (answer.HR_Request === "Create a new Department") {
          const newDepartment = new Department(answer.Department_Name);
          console.log(newDepartment);
          con.query("INSERT INTO department SET ?", newDepartment, err => {
            if (err) {
              throw err;
            }
            console.log("Sucessfully inserted into database");
            initializeInquirer();
          });
        } else if (answer.HR_Request === "Create a new Role") {
          const departmentName = answer.role_department.toString();
          con.query("SELECT id FROM department WHERE name = ?", departmentName, (err, res) => {
            if (err) {
              throw err;
            }

            let departmentId = res[0].id;
            const newRole = new Role(answer.role_title, Number(answer.role_salary), departmentId);
            con.query("INSERT INTO role SET ?", newRole, err => {
              if (err) {
                throw err;
              }
              console.log("New Role Sucessfully inserted into database");
              initializeInquirer();
            });
          });
        } else {
          console.log("Sorry, something went wrong");
        }
      });
  })();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

// module.exports.listOfDepartments = listOfDepartments;
