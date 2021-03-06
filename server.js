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
const { logger, setCriteria, setId } = require("./helper_functions");
const figlet = require("figlet");

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

  figlet("Employee Tracker", (err, data) => {
    console.log(err || data);
    console.log(" ");
  });

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
                    logger("DEPARTMENT ADDED", result);
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
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
                    logger("ROLE ADDED", result);
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
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
                      logger("LAST EMPLOYEE ADDED", result);
                      initializeInquirer();
                    } else {
                      const managerIdCriteria = setCriteria("first_name", answer.employee_manager, "last_name");
                      const managerId = await DBModel.getEmployeeIdFromName(managerIdCriteria);
                      const newEmployee = new Employee(firstName, lastName, roleId[0].id, managerId[0].id);
                      await DBModel.addEmployee(newEmployee);
                      const result = await DBModel.getLastEmployeeAdded();
                      logger("LAST EMPLOYEE ADDED", result);
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
            logger("DEPARTMENTS:", currentDepartments);
            initializeInquirer();
            break;
          case "View Roles":
            logger("ROLES:", currentRoles);
            initializeInquirer();
            break;
          case "View Employees":
            (async () => {
              try {
                const employeesFullDetails = await DBModel.getEmployeesFullDetails();
                logger("EMPLOYEES:", employeesFullDetails);
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
                logger("EMPLOYEES:", employeesByManager);
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
                logger("UTILIZED BUDGET BY DEPARTMENT:", utilizedBudgetByDepartement);
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
                    const roleCriteria = setId("role_id", roleId);
                    const nameCriteria = setCriteria("first_name", answer.employee_to_update_role, "last_name");
                    await DBModel.updateRoleFromEmployee([...roleCriteria, ...nameCriteria]);
                    const firstNameCriteria1 = setCriteria("e.first_name", nameCriteria[0].first_name);
                    const lastNameCriteria1 = setCriteria("e.last_name", nameCriteria[1].last_name);
                    const firstNameCriteria2 = setCriteria("eee.first_name", nameCriteria[0].first_name);
                    const lastNameCriteria2 = setCriteria("eee.last_name", nameCriteria[1].last_name);
                    const result = await DBModel.getEmployeeInfoFromEmployeeName([
                      firstNameCriteria1,
                      lastNameCriteria1,
                      firstNameCriteria2,
                      lastNameCriteria2
                    ]);
                    logger("EMPLOYEE ROLE WAS UPDATED:", result);
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
                    const employee = setCriteria("first_name", answer.employee_to_update_manager, "last_name");
                    const employeeId = await DBModel.getEmployeeIdFromName(employee);
                    const managerName = setCriteria("first_name", answer.new_manager, "last_name");
                    const tempManagerId = await DBModel.getEmployeeIdFromName(managerName);
                    console.log(tempManagerId);
                    const managerId = setId("manager_id", tempManagerId);
                    await DBModel.updateManagerOfEmployee([...managerId, ...employeeId]);
                    const eCriteria = setId("e.id", employeeId);
                    const eeeCriteria = setId("eee.id", employeeId);
                    const result = await DBModel.getEmployeeInfoFromEmployeeId([...eCriteria, ...eeeCriteria]);
                    logger("NEW MANAGER ASSIGNED TO EMPLOYEE", result);
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
              })
              .catch(err => console.log(err));
            break;
          case "Delete Department":
            inquirer
              .prompt([
                new ListQuestion("delete_department", "Select the Department you would like to delete:", [
                  ...currentDepartments
                ])
              ])
              .then(answer => {
                (async () => {
                  try {
                    const departmentNameCriteria = [{ name: answer.delete_department.toLowerCase().trim() }];
                    const countRoles = await DBModel.numberOfRolesInDepartment(departmentNameCriteria);

                    if (countRoles[0].roleCount > 0) {
                      const rolesInDepartment = await DBModel.showDepartmentRoles(departmentNameCriteria);
                      logger("DEPARTMENT HAS ROLES AND CANNOT BE DELETED", rolesInDepartment);
                    } else {
                      const departmentId = await DBModel.getDepartmentId(departmentNameCriteria);
                      const deletedDepartment = await DBModel.getDepartment(departmentId);
                      await DBModel.deleteDepartment(departmentId);
                      logger("DELETED DEPARTMENT", deletedDepartment);
                    }
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
              })
              .catch(err => console.log(err));
            break;
          case "Delete Role":
            inquirer
              .prompt([new ListQuestion("delete_role", "Select the Role ro delete", [...rolesChoice])])
              .then(answer => {
                (async () => {
                  try {
                    const roleTitleCriteria = [{ title: answer.delete_role.toLowerCase().trim() }];
                    const countEmployees = await DBModel.numberOfEmployeesWithRole(roleTitleCriteria);
                    if (countEmployees[0].employeeCount > 0) {
                      const employeesWithRole = await DBModel.listOfEmployeesByRole(roleTitleCriteria);
                      logger("YOU CANNOT DELETE THIS ROLE WHILE HAVING EMPLOYEES WITH IT", employeesWithRole);
                    } else {
                      const deletedRole = await DBModel.getRole(roleTitleCriteria);
                      await DBModel.deleteRole(roleTitleCriteria);
                      logger("DELETED ROLE", deletedRole);
                    }
                    initializeInquirer();
                  } catch (err) {
                    console.log(err);
                  }
                })();
              })
              .catch(err => console.log(err));
            break;
          case "Delete Employee":
            inquirer
              .prompt([new ListQuestion("delete_employee", "Select the employee to delete:", [...employeeChoice])])
              .then(answer => {
                (async () => {
                  try {
                    const employeeToDeleteCriteria = setCriteria("first_name", answer.delete_employee, "last_name");
                    const employeeToDeleteCriteriaE = setCriteria(
                      "e.first_name",
                      answer.delete_employee,
                      "e.last_name"
                    );
                    const employeeToDeleteCriteriaEee = setCriteria(
                      "eee.first_name",
                      answer.delete_employee,
                      "eee.last_name"
                    );
                    const employeeInfo = await DBModel.getEmployeeInfoFromEmployeeName([
                      ...employeeToDeleteCriteriaE,
                      ...employeeToDeleteCriteriaEee
                    ]);
                    await DBModel.deleteEmployee(employeeToDeleteCriteria);
                    logger("EMPLOYEE DELETED", employeeInfo);
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
