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
    const employeeChoice = currentEmployees.map(employee => {
      return {
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`
      };
    });
    const rolesChoice = currentRoles.map(role => {
      return {
        id: role.id,
        name: role.title
      };
    });
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
                  ...employeeChoice
                ])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const firstName = answer.employee_firstName.toLowerCase().trim();
                    const lastName = answer.employee_lastName.toLowerCase().trim();
                    const roleIdCriteria = { title: answer.employee_role.toLowerCase().trim() };
                    const roleId = await DBModel.getRoleIdFromRoleTitle(roleIdCriteria);
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
          case "View Departments":
            console.log(" ");
            console.table("DEPARTMENTS:", currentDepartments);
            initializeInquirer();
            break;
          case "View Roles":
            console.log(" ");
            console.table("ROLES:", currentRoles);
            initializeInquirer();
            break;
          case "View Employees":
            (async () => {
              try {
                const employeesFullDetails = await DBModel.getEmployeesFullDetails();
                console.log(" ");
                console.table("EMPLOYEES:", employeesFullDetails);
                initializeInquirer();
              } catch (err) {
                console.log(err);
              }
            })();
            break;
          case "View Employees by Manager":
            (async () => {
              try {
                const employeesByManager = await DBModel.getEmployeesByManager();
                console.log(" ");
                console.table("EMPLOYEES:", employeesByManager);
                initializeInquirer();
              } catch (err) {
                console.log(err);
              }
            })();
            break;
          case "View the total utilized budget by department":
            (async () => {
              try {
                const utilizedBudgetByDepartement = await DBModel.getUtilizedBudgetByDepartement();
                console.log(" ");
                console.table("UTILIZED BUDGET BY DEPARTMENT:", utilizedBudgetByDepartement);
                initializeInquirer();
              } catch (err) {
                console.log(err);
              }
            })();
            break;
          case "Update employee role":
            inquirer
              .prompt([
                new ListQuestion("employee_to_update_role", "Select the employee to update role:", [...employeeChoice]),
                new ListQuestion("new_role", "Select the new role:", [...rolesChoice])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const roleIdCriteria = { title: answer.new_role.toLowerCase().trim() };
                    const roleId = await DBModel.getRoleIdFromRoleTitle(roleIdCriteria);
                    const roleCriteria = {
                      role_id: roleId[0].id
                    };
                    const firstNameCriteria = {
                      first_name: answer.employee_to_update_role
                        .toLowerCase()
                        .trim()
                        .split(" ")[0]
                    };
                    const lastNameCriteria = {
                      last_name: answer.employee_to_update_role
                        .toLowerCase()
                        .trim()
                        .split(" ")[1]
                    };
                    await DBModel.updateRoleFromEmployee([roleCriteria, firstNameCriteria, lastNameCriteria]);
                    const firstNameCriteriaCall1 = {
                      "e.first_name": firstNameCriteria.first_name
                    };
                    const lastNameCriteriaCall1 = {
                      "e.last_name": lastNameCriteria.last_name
                    };
                    const firstNameCriteriaCall2 = {
                      "eee.first_name": firstNameCriteria.first_name
                    };
                    const lastNameCriteriaCall2 = {
                      "eee.last_name": lastNameCriteria.last_name
                    };
                    const result = await DBModel.getEmployeeInfoFromEmployeeName([
                      firstNameCriteriaCall1,
                      lastNameCriteriaCall1,
                      firstNameCriteriaCall2,
                      lastNameCriteriaCall2
                    ]);
                    console.log(" ");
                    console.table("EMPLOYEE ROLE WAS UPDATED:", result);
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
              })
              .catch(err => console.log(err));
            break;
          case "Update employee manager":
            inquirer
              .prompt([
                new ListQuestion("employee_to_update_manager", "Select the employee to update manager:", [
                  ...employeeChoice
                ]),
                new ListQuestion("new_manager", "Select the new manager:", [...employeeChoice])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const firstNameEmployee = {
                      first_name: answer.employee_to_update_manager
                        .toLowerCase()
                        .trim()
                        .split(" ")[0]
                    };
                    const lastNameEmployee = {
                      last_name: answer.employee_to_update_manager
                        .toLowerCase()
                        .trim()
                        .split(" ")[1]
                    };
                    const employeeId = await DBModel.getEmployeeIdFromName([firstNameEmployee, lastNameEmployee]);
                    const firstNameManager = {
                      first_name: answer.new_manager
                        .toLowerCase()
                        .trim()
                        .split(" ")[0]
                    };
                    const lastNameManager = {
                      last_name: answer.new_manager
                        .toLowerCase()
                        .trim()
                        .split(" ")[1]
                    };
                    const tempManagerId = await DBModel.getEmployeeIdFromName([firstNameManager, lastNameManager]);
                    const managerId = tempManagerId.map(id => {
                      return {
                        manager_id: id.id
                      };
                    });
                    await DBModel.updateManagerOfEmployee([...managerId, ...employeeId]);
                    const eCriteria = employeeId.map(id => {
                      return {
                        "e.id": id.id
                      };
                    });
                    const eeeCriteria = employeeId.map(id => {
                      return {
                        "eee.id": id.id
                      };
                    });
                    const result = await DBModel.getEmployeeInfoFromEmployeeId([...eCriteria, ...eeeCriteria]);
                    console.log(" ");
                    console.table("NEW MANAGER ASSIGNED TO EMPLOYEE", result);
                    initializeInquirer();
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

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
