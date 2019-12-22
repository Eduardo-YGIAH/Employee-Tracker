const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const Department = require("./hr_modules/department");
const Role = require("./hr_modules/role");
const Employee = require("./hr_modules/employee");
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
    let managers = await DBModel.getManagers();
    let managersList = managers.map(manager => {
      return {
        name: `${manager.first_name} ${manager.last_name}`
      };
    });

    // let juniorDevelopers = await DBModel.getManagers();
    // console.log(currentDepartments);
    // console.log(currentRoles);
    // console.log(currentEmployees);

    inquirer
      .prompt([
        {
          type: "list",
          message: "What would you like to do?",
          name: "hr_request",
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
          name: "department_name",
          message: "Give a name to the new Department.",
          when: function(answer) {
            return answer.hr_request === "Create a new Department";
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
            return answer.hr_request === "Create a new Role";
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
            return answer.role_salary;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to assign a department to the new Role.`;
            }

            return true;
          }
        },
        {
          type: "input",
          name: "employee_firstName",
          message: "Type the new employee's first name:",
          when: function(answer) {
            return answer.hr_request === "Add an Employee";
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to provide the employee's first name`;
            }

            return true;
          }
        },
        {
          type: "input",
          name: "employee_lastName",
          message: "Type the new employee's last name:",
          when: function(answer) {
            return answer.employee_firstName;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to provide the employee's last name`;
            }

            return true;
          }
        },
        {
          type: "list",
          name: "employee_department",
          message: "To what department will this employee be assigned?",
          choices: currentDepartments.map(department => {
            return {
              id: department.id,
              name: department.name
            };
          }),
          when: function(answer) {
            return answer.employee_lastName;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to assign a department to the employee.`;
            }

            return true;
          }
        },
        {
          type: "list",
          name: "employee_role",
          message: "Choose a role for this employee:",
          choices: currentRoles.map(role => {
            return {
              id: role.id,
              name: role.title
            };
          }),
          when: function(answer) {
            return answer.employee_department;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to assign a role to the employee.`;
            }

            return true;
          }
        },
        {
          type: "list",
          name: "employee_supervisor",
          message: "Choose the manager who will supervise this employee:",
          choices: [
            {
              name: "Assign later or no superviser"
            },
            ...managersList
          ],
          when: function(answer) {
            return answer.employee_role;
          }
        },
        {
          type: "list",
          name: "old_department_name",
          message: "What department you would like to change the name?",
          choices: currentDepartments,
          when: function(answer) {
            return answer.hr_request === "Change Department name";
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to select a department to change the name.`;
            }

            return true;
          }
        },
        {
          type: "input",
          name: "new_department_name",
          message: "Type the new name for the department:",
          when: function(answer) {
            return answer.old_department_name;
          },
          validate: function(answer) {
            if (!answer) {
              return `You need to provide a new name to the department.`;
            }

            return true;
          }
        }
      ])
      .then(answer => {
        // CREATE A NEW DEPARTMENT
        if (answer.hr_request === "Create a new Department") {
          const newDepartment = new Department(
            answer.department_name
              .toString()
              .toLowerCase()
              .trim()
          );
          con.query("INSERT INTO departments SET ?", newDepartment, err => {
            if (err) {
              throw err;
            }
            console.info("Sucessfully inserted into database");
            initializeInquirer();
          });
          // CREATE A NEW ROLE
        } else if (answer.hr_request === "Create a new Role") {
          const criteria = {
            name: answer.role_department
              .toString()
              .toLowerCase()
              .trim()
          };

          con.query("SELECT id FROM departments WHERE ?", criteria, (err, res) => {
            if (err) {
              throw err;
            }

            let departmentId = res[0].id;
            let newRoleTitle = answer.role_title
              .toString()
              .toLowerCase()
              .trim();
            const newRole = new Role(newRoleTitle, Number(answer.role_salary.trim()), departmentId);
            con.query("INSERT INTO roles SET ?", newRole, err => {
              if (err) {
                throw err;
              }
              console.info("New Role Sucessfully inserted into database");
              initializeInquirer();
            });
          });
          // ADD A NEW EMPLOYEE - constructor(firstName, lastName, roleId, departmentId, managerId)
        } else if (answer.hr_request === "Add an Employee") {
          console.log(answer);
          const first_name = answer.employee_firstName
            .toString()
            .toLowerCase()
            .trim();
          const last_name = answer.employee_lastName
            .toString()
            .toLowerCase()
            .trim();
          // GET ROLE ID FROM ROLE TITLE
          const criteriaRole = {
            title: answer.employee_role
              .toString()
              .toLowerCase()
              .trim()
          };
          con.query("SELECT id FROM roles WHERE ?", criteriaRole, (err, res) => {
            if (err) {
              throw err;
            }
            const role_id = res[0].id;
            // GET DEPARTMENT ID FROM DEPARTMENT NAME
            const criteriaDepartment = {
              name: answer.employee_department
                .toString()
                .toLowerCase()
                .trim()
            };
            con.query("SELECT id FROM departments WHERE ?", criteriaDepartment, (err, res) => {
              if (err) {
                throw err;
              }
              const department_id = res[0].id;
              console.log(first_name, last_name, role_id, department_id);
              // VERIFY IF EMPLOYEE HAS MANAGER ASSIGNED

              if (answer.employee_supervisor === "Assign later or no superviser") {
                //CREATE NEW EMPLOYEE OBJECT WITH NO MANAGER ASSIGNED
                const newEmployeeObj = new Employee(first_name, last_name, role_id, department_id);
                con.query("INSERT INTO employees SET ?", newEmployeeObj, (err, res) => {
                  if (err) {
                    throw err;
                  }
                  console.info("New employee added to database.");

                  initializeInquirer();
                });
              } else {
                // IF HAS MANAGER GET MANAGER ID FROM MANAGER NAME
                const firstName = answer.employee_supervisor
                  .toString()
                  .toLowerCase()
                  .trim()
                  .split(" ")[0];
                const lastName = answer.employee_supervisor
                  .toString()
                  .toLowerCase()
                  .trim()
                  .split(" ")[1];
                const criteriaManagerId1 = {
                  first_name: firstName
                };
                const criteriaManagerId2 = {
                  last_name: lastName
                };
                con.query(
                  "SELECT id FROM employees WHERE ? AND ?",
                  [criteriaManagerId1, criteriaManagerId2],
                  (err, res) => {
                    if (err) {
                      throw err;
                    }
                    const manager_id = res[0].id;
                    //CREATE NEW EMPLOYEE OBJECT WITH MANAGER ASSIGNED
                    const newEmployeeObj = new Employee(first_name, last_name, role_id, department_id, manager_id);
                    console.log(newEmployeeObj);
                    con.query("INSERT INTO employees SET ?", newEmployeeObj, (err, res) => {
                      if (err) {
                        throw err;
                      }
                      console.info("New employee added to database.");

                      initializeInquirer();
                    });
                  }
                );
              }
            });
          });
        } else if (answer.hr_request === "View Departments") {
          con.query("SELECT * FROM departments", (err, res) => {
            if (err) {
              throw err;
            }
            console.log("DEPARTMENTS:");
            console.table(res);
            initializeInquirer();
          });
        } else if (answer.hr_request === "View Roles") {
          con.query("SELECT * FROM roles", (err, res) => {
            if (err) {
              throw err;
            }
            console.log("ROLES:");
            console.table(res);
            initializeInquirer();
          });
        } else if (answer.hr_request === "View Employees") {
          con.query("SELECT * FROM employees", (err, res) => {
            if (err) {
              throw err;
            }
            console.log("Employees:");
            console.table(res);
            initializeInquirer();
          });
        } else if (answer.hr_request === "Change Department name") {
          // GET ID FROM DEPARTMENT OLD NAME

          const criteriaOldDepartmentName = {
            name: answer.old_department_name
          };
          con.query("SELECT id FROM departments WHERE ?", criteriaOldDepartmentName, (err, res) => {
            if (err) {
              throw err;
            }
            const oldDepartmentId = {
              id: res[0].id
            };
            // GET NEW NAME FOR THE DEPARTMENT
            const criteriaNewDepartmentName = {
              name: answer.new_department_name.toLowerCase().trim()
            };

            // UPDATE DEPARTMENT NAME WITH NEW PARAMATERS
            con.query("UPDATE departments SET ? WHERE ?", [criteriaNewDepartmentName, oldDepartmentId], (err, res) => {
              if (err) {
                throw err;
              }
              console.info("Department name has been changed.");
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
