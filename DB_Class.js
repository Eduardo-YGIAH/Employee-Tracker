class DB {
  constructor(db) {
    this.db = db;
  }

  async getDepartments() {
    // IN USE
    let query = "SELECT * FROM department";
    return this.doQuery(query);
  }

  async getDepartment(criteria) {
    // IN USE - criteria = [ { name: departmentName } ] || [ { id: departmentId } ]
    let query = "SELECT * FROM department WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getDepartmentId(criteria) {
    // IN USE - criteria = [ { name: departmentName } ]
    let query = "SELECT id FROM department WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async createDepartment(criteria) {
    // IN USE - criteria = [ { name: newDepartmentName } ]
    let query = "INSERT INTO department SET ?";
    return this.doQueryParams(query, criteria);
  }

  async getRoles() {
    // IN USE
    let query = "SELECT * FROM role";
    return this.doQuery(query);
  }

  async getRole(criteria) {
    // IN USE - criteria = [ { title: roleTitle } ] || [ { id: roleId } ]
    let query = "SELECT * FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async addNewRole(criteria) {
    // IN USE - criteria = [ { title: roleTitle, salary: Number, department_id: departmentId  } ]
    let query = "INSERT INTO role SET ?";
    return this.doQueryParams(query, criteria);
  }

  async getRoleIdFromRoleTitle(criteria) {
    // IN USE - criteria = [ { title: roleTitle } ]
    let query = "SELECT id FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployees() {
    // IN USE
    let query = "SELECT * FROM employee";
    return this.doQuery(query);
  }

  async addEmployee(criteria) {
    // IN USE - criteria = [ { first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId } ] || [ { first_name: firstName, last_name: lastName, role_id: roleId } ]
    let query = "INSERT INTO employee SET ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployeeIdFromName(criteria) {
    // IN USE - criteria = [ { first_name: firstName }, { last_name: lastName } ]
    let query = "SELECT id FROM employee WHERE ? AND ? LIMIT 1";
    return this.doQueryParams(query, criteria);
  }

  async getEmployeeInfoFromEmployeeName(criteria) {
    // IN USE - criteria = [ {e.first_name: "firstName"}, {e.last_name: "lastName"}, {eee.first_name: "firstName"}, {eee.last_name: "lastName"}]
    let query =
      "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id WHERE ? AND ? UNION SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager FROM employee eee JOIN role rr ON  eee.role_id = rr.id JOIN department dd ON rr.department_id = dd.id WHERE eee.manager_id IS NULL AND ? AND ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployeeInfoFromEmployeeId(criteria) {
    // IN USE - criteria = [ {e.id: id}, {eee.id: id}]
    let query =
      "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id WHERE ? UNION SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager FROM employee eee JOIN role rr ON  eee.role_id = rr.id JOIN department dd ON rr.department_id = dd.id WHERE eee.manager_id IS NULL AND ?";
    return this.doQueryParams(query, criteria);
  }

  async getLastEmployeeAdded() {
    // IN USE
    let query = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
    return this.doQuery(query);
  }

  async getEmployeesFullDetails() {
    // IN USE
    let query =
      "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id UNION SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager FROM employee eee JOIN role rr ON  eee.role_id = rr.id JOIN department dd ON rr.department_id = dd.id WHERE eee.manager_id IS NULL ORDER BY department";
    return this.doQuery(query);
  }

  async getEmployeesByManager() {
    //IN USE
    let query =
      "SELECT  CONCAT(ee.first_name,' ',ee.last_name) `manager`, d.name AS department, e.id, e.first_name, e.last_name, r.title, r.salary FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id ORDER BY manager";
    return this.doQuery(query);
  }

  async getUtilizedBudgetByDepartement() {
    //IN USE
    let query =
      "SELECT d.name AS department, ro.budget AS spending_budget FROM department d JOIN (SELECT r.department_id as id, SUM(r.salary) AS budget FROM role r JOIN employee e WHERE e.role_id = r.id GROUP BY id) ro WHERE d.id = ro.id ORDER BY spending_budget";
    return this.doQuery(query);
  }

  async updateRoleFromEmployee(criteria) {
    // IN USE - criteria = [ { role_id: roleId }, { first_name: firstName }, { last_name: lastName } ]
    let query = "UPDATE employee SET ? WHERE ? AND ?";
    return this.doQueryParams(query, criteria);
  }

  async updateManagerOfEmployee(criteria) {
    // IN USE - criteria = [ { manager_id: managerId }, { id: employeeId }]
    let query = "UPDATE employee SET ? WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async numberOfRolesInDepartment(criteria) {
    // IN USE - criteria = [ { d.name: departmentName } ]
    let query = "SELECT COUNT(d.name) AS roleCount FROM department d JOIN role r ON r.department_id = d.id WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async showDepartmentRoles(criteria) {
    // IN USE - criteria = [ { d.name: departmentName } ]
    let query =
      "SELECT d.id AS department_id, d.name AS department, r.id AS role_id, r.title AS role_title FROM department d JOIN role r ON r.department_id = d.id WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async deleteDepartment(criteria) {
    // IN USE - criteria = [ {id: departmentId}]
    let query = "DELETE FROM department WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async numberOfEmployeesWithRole(criteria) {
    // IN USE - criteria = [{ r.title: roleTitle }]
    let query = "SELECT COUNT(e.id) AS employeeCount FROM employee e JOIN role r ON e.role_id = r.id WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async listOfEmployeesByRole(criteria) {
    //IN USE - criteria = [ { r.title: roleTitle } ]
    let query =
      "SELECT r.id AS role_id, r.title AS role_title, e.id AS employee_id, CONCAT(e.first_name,' ',e.last_name) `employee` FROM role r JOIN employee e ON e.role_id = r.id WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async deleteRole(criteria) {
    // IN USE - criteria = [ { title: roleTitle } ] || [ { id: roleId } ]
    let query = "DELETE FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async showManager(criteria) {
    // IN USE - criteria = [ { first_name: employeeFirstName }, { last_name: employeeLastName } ]
    let query = "SELECT manager_id FROM employee WHERE ? AND ?";
    return this.doQueryParams(query, criteria);
  }

  async deleteEmployee(criteria) {
    // IN USE - criteria = [ { first_name: employeeFirstName }, { last_name: employeeLastName } ]
    let query = "DELETE FROM employee WHERE ? AND ?";
    return this.doQueryParams(query, criteria);
  }

  // ===================================
  // CORE FUNCTIONS DON'T TOUCH
  // ===================================
  async doQuery(queryToDo) {
    let pro = new Promise((resolve, reject) => {
      let query = queryToDo;
      this.db.query(query, function(err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
    return pro.then(val => {
      return val;
    });
  }
  async doQueryParams(queryToDo, array) {
    let pro = new Promise((resolve, reject) => {
      let query = queryToDo;
      this.db.query(query, array, function(err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
    return pro.then(val => {
      return val;
    });
  }
}

module.exports = DB;
