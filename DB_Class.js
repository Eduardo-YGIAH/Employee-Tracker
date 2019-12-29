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
    // IN USE
    let query = "SELECT * FROM department WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getDepartmentId(departmentNameArray) {
    // IN USE
    let query = "SELECT id FROM department WHERE ?";
    return this.doQueryParams(query, departmentNameArray);
  }

  async createDepartment(departmentNameArray) {
    // IN USE
    let query = "INSERT INTO department SET ?";
    return this.doQueryParams(query, departmentNameArray);
  }

  async getRoles() {
    // IN USE
    let query = "SELECT * FROM role";
    return this.doQuery(query);
  }

  async getRole(criteria) {
    // IN USE
    let query = "SELECT * FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async addNewRole(roleNameArray) {
    // IN USE
    let query = "INSERT INTO role SET ?";
    return this.doQueryParams(query, roleNameArray);
  }

  async getRoleIdFromRoleTitle(criteria) {
    // IN USE
    let query = "SELECT id FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployees() {
    // IN USE
    let query = "SELECT * FROM employee";
    return this.doQuery(query);
  }

  async addEmployee(criteria) {
    // IN USE
    let query = "INSERT INTO employee SET ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployeeIdFromName(criteria) {
    // IN USE
    let query = "SELECT id FROM employee WHERE ? AND ? LIMIT 1";
    return this.doQueryParams(query, criteria);
  }

  async getEmployeeInfoFromEmployeeName(criteria) {
    // IN USE - criteria = [ {e.first_name: "firstName"}, {e.last_name: "lastName"}, {eee.first_name: "firstName"}, {eee.last_name: "lastName"}]
    let query =
      "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee ee ON ee.id = e.manager_id WHERE ? AND ? UNION SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager FROM employee eee JOIN role rr ON  eee.role_id = rr.id JOIN department dd ON rr.department_id = dd.id WHERE eee.manager_id IS NULL AND ? AND ?";
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
      "SELECT d.name AS department, ro.budget AS spending_budget FROM department d JOIN (SELECT r.department_id as id, SUM(r.salary) AS budget FROM role r JOIN employee e WHERE e.role_id = r.id GROUP BY id) ro WHERE d.id = ro.id";
    return this.doQuery(query);
  }

  async updateRoleFromEmployee(criteria) {
    // IN USE
    let query = "UPDATE employee SET ? WHERE ? AND ?";
    return this.doQueryParams(query, criteria);
  }

  async getManagers() {
    let query =
      "SELECT distinct CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN employee ee ON ee.id = e.manager_id";
    return this.doQuery(query);
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
