class Employee {
  constructor(first_name, last_name, role_id, department_id, manager_id = null) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.department_id = department_id;
    this.manager_id = manager_id;
  }
}
module.exports = Employee;