class DB {
  constructor(db) {
    this.db = db;
  }

  async getDepartments() {
    let query = "SELECT * FROM department";
    return this.doQuery(query);
  }

  async getDepartment(criteria) {
    let query = "SELECT * FROM department WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getRoles() {
    let query = "SELECT * FROM role";
    return this.doQuery(query);
  }

  async getRole(criteria) {
    let query = "SELECT * FROM role WHERE ?";
    return this.doQueryParams(query, criteria);
  }

  async getEmployees() {
    let query = "SELECT * FROM employee";
    return this.doQuery(query);
  }
  async getManagers() {
    let query =
      "SELECT distinct CONCAT(ee.first_name,' ',ee.last_name) `manager` FROM employee e JOIN role r ON  e.role_id = r.id JOIN employee ee ON ee.id = e.manager_id";
    return this.doQuery(query);
  }

  async createDepartment(departmentNameArray) {
    let query = "INSERT INTO department SET ?";
    return this.doQueryParams(query, departmentNameArray);
  }

  async getDepartmentId(departmentNameArray) {
    let query = "SELECT id FROM department WHERE ?";
    return this.doQueryParams(query, departmentNameArray);
  }

  async addNewRole(roleNameArray) {
    let query = "INSERT INTO role SET ?";
    return this.doQueryParams(query, roleNameArray);
  }

  //   async getUserById(array) {
  //     let query = "SELECT * FROM asimov_users WHERE id = ?";
  //     return this.doQueryParams(query, array);
  //   }

  // CORE FUNCTIONS DON'T TOUCH
  async doQuery(queryToDo) {
    let pro = new Promise((resolve, reject) => {
      let query = queryToDo;
      this.db.query(query, function(err, result) {
        if (err) throw err; // GESTION D'ERREURS
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
        if (err) throw err; // GESTION D'ERREURS
        resolve(result);
      });
    });
    return pro.then(val => {
      return val;
    });
  }
}

module.exports = DB;
