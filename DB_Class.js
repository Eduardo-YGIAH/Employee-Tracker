class DB {
  constructor(db) {
    this.db = db;
  }

  async getDepartments() {
    let query = "SELECT * FROM department";
    return this.doQuery(query);
  }

  async getRoles() {
    let query = "SELECT * FROM role";
    return this.doQuery(query);
  }
  async getEmployees() {
    let query = "SELECT * FROM employee";
    return this.doQuery(query);
  }

  async createDepartment(array) {
    let query = "INSERT INTO department SET ?";
    return this.doQueryParams(query, array);
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
