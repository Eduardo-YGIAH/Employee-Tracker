class DB {
  constructor(db) {
    this.db = db;
  }

  async getDepartments() {
    let query = "SELECT * FROM departments";
    return this.doQuery(query);
  }

  async getRoles() {
    let query = "SELECT * FROM roles";
    return this.doQuery(query);
  }
  async getEmployees() {
    let query = "SELECT * FROM employees";
    return this.doQuery(query);
  }
  async getManagers() {
    let query =
      "SELECT employees.id, employees.first_name, employees.last_name, employees.department_id FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.title = 'manager'";
    return this.doQuery(query);
  }

  async createDepartment(departmentNameArray) {
    let query = "INSERT INTO departments SET ?";
    return this.doQueryParams(query, departmentNameArray);
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
