const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Department = require("./hr_modules/department");
const Role = require("./hr_modules/role");
const Employee = require("./hr_modules/employee");
const DB = require("./DB_Class");
const initialChoices = require("./inquirer_modules/choices");
const { InputTextQuestion, InputNumberQuestion, ListQuestion } = require("./inquirer_modules/questions");

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
    const currentDepartments = await DBModel.getDepartments();
    const currentRoles = await DBModel.getRoles();
    const currentEmployees = await DBModel.getEmployees();
    inquirer
      .prompt([new ListQuestion("initial_question", "What would you like to do?", initialChoices)])
      .then(answer => {
        switch (answer.initial_question) {
          case "Create a new Department":
            inquirer
              .prompt([
                new InputTextQuestion(
                  "department_name",
                  "Give a name to the new Department.",
                  "You need to provide a name to the Department."
                )
              ])
              .then(answer => {
                (async () => {
                  try {
                    const newDepartment = await new Department(answer.department_name.toLowerCase().trim());
                    await DBModel.createDepartment([newDepartment]);
                    const result = await DBModel.getDepartment([newDepartment]);
                    console.log(" ");
                    console.table("DEPARTMENT ADDED", result);
                  } catch (err) {
                    console.log(err);
                  }
                })();
                initializeInquirer();
              })
              .catch(err => console.log(err));
            break;
          case "Create a new Role":
            inquirer
              .prompt([
                new InputTextQuestion(
                  "role_title",
                  "Give a title to the new Role.",
                  "You need to give a title to the role."
                ),
                new InputNumberQuestion(
                  "role_salary",
                  "Set a salary to the new Role.",
                  "You need to provide an anual salary to the new Role as a decimal number. Note: £10,000.00 = 10000.00"
                ),
                new ListQuestion("role_department", "To what department does this role belongs to?", [
                  ...currentDepartments
                ])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const department = await DBModel.getDepartmentId([
                      { name: answer.role_department.toLowerCase().trim() }
                    ]);
                    const departmentId = department[0].id;
                    const newRole = new Role(
                      answer.role_title.toLowerCase().trim(),
                      Number(answer.role_salary.trim()),
                      departmentId
                    );
                    await DBModel.addNewRole([newRole]);
                    const result = await DBModel.getRole([{ title: answer.role_title.toLowerCase().trim() }]);
                    console.log(" ");
                    console.table("ROLE ADDED", result);
                  } catch (err) {
                    console.log(err);
                  }
                })();
                initializeInquirer();
              })
              .catch(err => console.log(err));
            break;
          case "Add an Employee":
            const rolesChoice = currentRoles.map(role => {
              return {
                id: role.id,
                name: role.title
              };
            });
            const managerChoice = currentEmployees.map(employee => {
              return {
                id: employee.id,
                name: `${employee.first_name} ${employee.last_name}`
              };
            });
            inquirer
              .prompt([
                new InputTextQuestion(
                  "employee_firstName",
                  "Type the new employee's first name:",
                  "You need to provide the first name of the new employee."
                ),
                new InputTextQuestion(
                  "employee_lastName",
                  "Type the new employee's last name:",
                  "You need to provide the last name of the new employee."
                ),
                new ListQuestion("employee_role", "Select the employee role:", [...rolesChoice]),
                new ListQuestion("employee_manager", "Select who will manage this employee:", [
                  "Does not apply or if you would like to select later.",
                  ...managerChoice
                ])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const firstName = answer.employee_firstName.toLowerCase().trim();
                    console.log(firstName);
                    const lastName = answer.employee_lastName.toLowerCase().trim();
                    console.log(lastName);
                    const roleIdCriteria = { title: answer.employee_role.toLowerCase().trim() };
                    const roleId = await DBModel.getRoleIdFromRoleTitle(roleIdCriteria);
                    console.log(roleId);
                    if (answer.employee_manager === "Does not apply or if you would like to select later.") {
                      const newEmployee = new Employee(firstName, lastName, roleId[0].id);
                      await DBModel.addEmployee(newEmployee);
                      const result = await DBModel.getLastEmployeeAdded();
                      console.log(" ");
                      console.table("LAST EMPLOYEE ADDED", result);
                      initializeInquirer();
                    } else {
                      const managerIdCriteria1 = {
                        first_name: answer.employee_manager
                          .toLowerCase()
                          .trim()
                          .split(" ")[0]
                      };
                      const managerIdCriteria2 = {
                        last_name: answer.employee_manager
                          .toLowerCase()
                          .trim()
                          .split(" ")[1]
                      };
                      const managerId = await DBModel.getEmployeeIdFromName([managerIdCriteria1, managerIdCriteria2]);
                      const newEmployee = new Employee(firstName, lastName, roleId[0].id, managerId[0].id);
                      await DBModel.addEmployee(newEmployee);
                      const result = await DBModel.getLastEmployeeAdded();
                      console.log(" ");
                      console.table("LAST EMPLOYEE ADDED", result);
                      initializeInquirer();
                    }
                  } catch (err) {
                    console.log(err);
                  }
                })();
              })
              .catch(err => console.log(err));
            break;
        }
      })
      .catch(err => console.log(err));
  })();
});

// (async function initializeInquirer() {
//   try {
//     let currentDepartments = await DBModel.getDepartments();
//     let currentRoles = await DBModel.getRoles();
//     let rolesList = currentRoles.map(role => {
//       return {
//         id: role.id,
//         name: role.title
//       };
//     });
//     let currentEmployees = await DBModel.getEmployees();

//     let employeeList = currentEmployees.map(employee => {
//       return {
//         name: `${employee.first_name} ${employee.last_name}`
//       };
//     });

//     inquirer
//       .prompt([
//         ...initial_question,
//         {
//           type: "input",
//           name: "department_name",
//           message: "Give a name to the new Department.",
//           when: function(answer) {
//             return answer.hr_request === "Create a new Department";
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to provide a name to the Department.`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "input",
//           name: "role_title",
//           message: "Give a title to the new Role.",
//           when: function(answer) {
//             return answer.hr_request === "Create a new Role";
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to provide a title to the new Role.`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "input",
//           name: "role_salary",
//           message: "Set a salary to the new Role.",
//           when: function(answer) {
//             return answer.role_title;
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to provide a salary to the new Role.`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "list",
//           name: "role_department",
//           message: "To what department does this role belongs to?",
//           choices: currentDepartments,
//           when: function(answer) {
//             return answer.role_salary;
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to assign a department to the new Role.`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "input",
//           name: "employee_firstName",
//           message: "Type the new employee's first name:",
//           when: function(answer) {
//             return answer.hr_request === "Add an Employee";
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to provide the employee's first name`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "input",
//           name: "employee_lastName",
//           message: "Type the new employee's last name:",
//           when: function(answer) {
//             return answer.employee_firstName;
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to provide the employee's last name`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "list",
//           name: "employee_role",
//           message: "Choose a role for this employee:",
//           choices: currentRoles.map(role => {
//             return {
//               id: role.id,
//               name: role.title
//             };
//           }),
//           when: function(answer) {
//             return answer.employee_lastName;
//           },
//           validate: function(answer) {
//             if (!answer) {
//               return `You need to assign a role to the employee.`;
//             }

//             return true;
//           }
//         },
//         {
//           type: "list",
//           name: "employee_supervisor",
//           message: "Choose the manager who will supervise this employee:",
//           choices: [
//             {
//               name: "Assign later or no superviser"
//             },
//             ...employeeList
//           ],
//           when: function(answer) {
//             return answer.employee_role;
//           }
//         },
//         {
//           type: "list",
//           name: "update_role",
//           message: "Choose the employee from you would like to update the role:",
//           choices: employeeList,
//           when: function(answer) {
//             return answer.hr_request === "Update employee role";
//           }
//         },
//         {
//           type: "list",
//           name: "select_new_role",
//           message: "Select the new role for the employee:",
//           choices: rolesList,
//           when: function(answer) {
//             return answer.update_role;
//           }
//         },
//         {
//           type: "list",
//           name: "pick_employee_to_update_manager",
//           message: "Select the employee to update the manager:",
//           choices: employeeList,
//           when: function(answer) {
//             return answer.hr_request === "Update employee manager";
//           }
//         },
//         {
//           type: "list",
//           name: "select_new_manager",
//           message: "Select the new manager for the employee:",
//           choices: employeeList,
//           when: function(answer) {
//             return answer.pick_employee_to_update_manager;
//           }
//         }
//       ])
//       // END OF QUESTIONS
//       .then(answer => {
//         // CREATE A NEW DEPARTMENT
//         if (answer.hr_request === "Create a new Department") {
//           const newDepartment = new Department(
//             answer.department_name
//               .toString()
//               .toLowerCase()
//               .trim()
//           );
//           con.query("INSERT INTO department SET ?", newDepartment, err => {
//             if (err) {
//               throw err;
//             }
//             console.info("Sucessfully inserted into database");
//             initializeInquirer();
//           });
//           // CREATE A NEW ROLE
// } else if (answer.hr_request === "Create a new Role") {
//   const criteria = {
//     name: answer.role_department
//       .toString()
//       .toLowerCase()
//       .trim()
//   };

//   con.query("SELECT id FROM department WHERE ?", criteria, (err, res) => {
//     if (err) {
//       throw err;
//     }

//     let departmentId = res[0].id;
//     let newRoleTitle = answer.role_title
//       .toString()
//       .toLowerCase()
//       .trim();
//     const newRole = new Role(newRoleTitle, Number(answer.role_salary.trim()), departmentId);
//     con.query("INSERT INTO role SET ?", newRole, err => {
//       if (err) {
//         throw err;
//       }
//       console.info("New Role Sucessfully inserted into database");
//               initializeInquirer();
//             });
//           });
//           // ADD A NEW EMPLOYEE - constructor(firstName, lastName, roleId, managerId)
//         } else if (answer.hr_request === "Add an Employee") {
//           console.log(answer);
//           const first_name = answer.employee_firstName
//             .toString()
//             .toLowerCase()
//             .trim();
//           const last_name = answer.employee_lastName
//             .toString()
//             .toLowerCase()
//             .trim();
//           // GET ROLE ID FROM ROLE TITLE
//           const criteriaRole = {
//             title: answer.employee_role
//               .toString()
//               .toLowerCase()
//               .trim()
//           };
//           con.query("SELECT id FROM role WHERE ?", criteriaRole, (err, res) => {
//             if (err) {
//               throw err;
//             }
//             const role_id = res[0].id;

//             // VERIFY IF EMPLOYEE HAS MANAGER ASSIGNED
//             if (answer.employee_supervisor === "Assign later or no superviser") {
//               //CREATE NEW EMPLOYEE OBJECT WITH NO MANAGER ASSIGNED
//               const newEmployeeObj = new Employee(first_name, last_name, role_id);
//               con.query("INSERT INTO employee SET ?", newEmployeeObj, (err, res) => {
//                 if (err) {
//                   throw err;
//                 }
//                 console.info("New employee added to database.");

//                 initializeInquirer();
//               });
//             } else {
//               // IF HAS MANAGER GET MANAGER ID FROM MANAGER NAME
//               const firstName = answer.employee_supervisor
//                 .toString()
//                 .toLowerCase()
//                 .trim()
//                 .split(" ")[0];
//               const lastName = answer.employee_supervisor
//                 .toString()
//                 .toLowerCase()
//                 .trim()
//                 .split(" ")[1];
//               const criteriaManagerId1 = {
//                 first_name: firstName
//               };
//               const criteriaManagerId2 = {
//                 last_name: lastName
//               };
//               con.query(
//                 "SELECT id FROM employee WHERE ? AND ? LIMIT 1",
//                 [criteriaManagerId1, criteriaManagerId2],
//                 (err, res) => {
//                   if (err) {
//                     throw err;
//                   }
//                   const manager_id = res[0].id;
//                   //CREATE NEW EMPLOYEE OBJECT WITH MANAGER ASSIGNED
//                   const newEmployeeObj = new Employee(first_name, last_name, role_id, manager_id);
//                   console.log(newEmployeeObj);
//                   con.query("INSERT INTO employee SET ?", newEmployeeObj, (err, res) => {
//                     if (err) {
//                       throw err;
//                     }
//                     console.info("New employee added to database.");

//                     initializeInquirer();
//                   });
//                 }
//               );
//             }
//           });
//           // VIEW DEPARTMENTS
//         } else if (answer.hr_request === "View Departments") {
//           con.query("SELECT * FROM department", (err, res) => {
//             if (err) {
//               throw err;
//             }
//             console.log("DEPARTMENTS:");
//             console.table(res);
//             initializeInquirer();
//           });
//           // VIEW ROLES
//         } else if (answer.hr_request === "View Roles") {
//           con.query("SELECT * FROM role", (err, res) => {
//             if (err) {
//               throw err;
//             }
//             console.log("ROLES:");
//             console.table(res);
//             initializeInquirer();
//           });
//           // VIEW EMPLOYEES DETAILS - ORDERED BY DEPARTMENT
//         } else if (answer.hr_request === "View Employees") {
//           con.query(
//             "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id UNION SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager FROM employee eee JOIN role rr ON  eee.role_id = rr.id JOIN department dd ON rr.department_id = dd.id WHERE eee.manager_id IS NULL ORDER BY department",
//             (err, res) => {
//               if (err) {
//                 throw err;
//               }
//               console.log("Employees:");
//               console.table(res);
//               initializeInquirer();
//             }
//           );
//           // VIEW EMPLOYEES BY MANAGER
//         } else if (answer.hr_request === "View Employees by Manager") {
//           con.query(
//             "SELECT  CONCAT(ee.first_name,' ',ee.last_name) `manager`, d.name AS department, e.id, e.first_name, e.last_name, r.title, r.salary FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id ORDER BY manager",
//             (err, res) => {
//               if (err) {
//                 throw err;
//               }
//               console.log("Employees:");
//               console.table(res);
//               initializeInquirer();
//             }
//           );
//           // VIEW DEPARTEMENTS BUDGET
//         } else if (answer.hr_request === "View the total utilized budget by department") {
//           con.query(
//             "SELECT d.name AS department, ro.budget AS spending_budget FROM department d JOIN (SELECT r.department_id as id, SUM(r.salary) AS budget FROM role r JOIN employee e WHERE e.role_id = r.id GROUP BY id) ro WHERE d.id = ro.id",
//             (err, res) => {
//               if (err) {
//                 throw err;
//               }
//               console.log("Employees:");
//               console.table(res);
//               initializeInquirer();
//             }
//           );
//           // UPDATE AN EMPLOYEE ROLE
//         } else if (answer.hr_request === "Update employee role") {
//           const firstName = answer.update_role
//             .toString()
//             .toLowerCase()
//             .trim()
//             .split(" ")[0];
//           const lastName = answer.update_role
//             .toString()
//             .toLowerCase()
//             .trim()
//             .split(" ")[1];
//           const criteriaEmployeeId1 = {
//             first_name: firstName
//           };
//           const criteriaEmployeeId2 = {
//             last_name: lastName
//           };
//           con.query(
//             "SELECT id FROM employee WHERE ? AND ?",
//             [criteriaEmployeeId1, criteriaEmployeeId2],
//             (err, res) => {
//               if (err) {
//                 throw err;
//               }
//               const employeeId = Number(res[0].id);
//               const criteriaForNewRoleId = {
//                 title: answer.select_new_role
//               };
//               con.query("SELECT id FROM role WHERE ?", criteriaForNewRoleId, (err, res) => {
//                 if (err) {
//                   throw err;
//                 }
//                 const roleId = Number(res[0].id);
//                 const criteria = [
//                   {
//                     role_id: roleId
//                   },
//                   {
//                     id: employeeId
//                   }
//                 ];
//                 con.query("UPDATE employee SET ? WHERE ?", criteria, (err, res) => {
//                   if (err) {
//                     throw err;
//                   }
//                   console.info("Role sucessfully updated");
//                   initializeInquirer();
//                 });
//               });
//             }
//           );
//         } else if (answer.hr_request === "Update employee manager") {
//           console.log("THIS IS THE ANSWER I NEED: " + answer.pick_employee_to_update_manager);
//           const firstName = answer.pick_employee_to_update_manager
//             .toString()
//             .toLowerCase()
//             .trim()
//             .split(" ")[0];
//           const lastName = answer.pick_employee_to_update_manager
//             .toString()
//             .toLowerCase()
//             .trim()
//             .split(" ")[1];
//           const criteriaEmployeeId1 = {
//             first_name: firstName
//           };
//           const criteriaEmployeeId2 = {
//             last_name: lastName
//           };
//           con.query(
//             "SELECT id FROM employee WHERE ? AND ?",
//             [criteriaEmployeeId1, criteriaEmployeeId2],
//             (err, res) => {
//               if (err) {
//                 throw err;
//               }
//               const employeeId = Number(res[0].id);
//               console.log("===================");
//               console.log("I AM LOOKING FOR THIS: " + answer.select_new_manager);
//               console.log("===================");
//               const managerFirstName = answer.select_new_manager
//                 .toString()
//                 .toLowerCase()
//                 .trim()
//                 .split(" ")[0];
//               const managerLastName = answer.select_new_manager
//                 .toString()
//                 .toLowerCase()
//                 .trim()
//                 .split(" ")[1];
//               const criteriaManagerId1 = {
//                 first_name: managerFirstName
//               };
//               const criteriaManagerId2 = {
//                 last_name: managerLastName
//               };
//               con.query(
//                 "SELECT id FROM employee WHERE ? AND ?",
//                 [criteriaManagerId1, criteriaManagerId2],
//                 (err, res) => {
//                   if (err) {
//                     throw err;
//                   }
//                   const managerId = Number(res[0].id);
//                   const criteria = [
//                     {
//                       manager_id: managerId
//                     },
//                     {
//                       id: employeeId
//                     }
//                   ];
//                   con.query("UPDATE employee SET ? WHERE ?", criteria, (err, res) => {
//                     if (err) {
//                       throw err;
//                     }
//                     console.info("Manager sucessfully updated for the selected employee.");
//                     initializeInquirer();
//                   });
//                 }
//               );
//             }
//           );
//         } else {
//           console.log("Sorry, something went wrong");
//         }
//       });
//   } catch (err) {
//     throw new Error("We are catching errors somewhere!");
//   }
// })();

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

// module.exports.listOfDepartments = listOfDepartments;
