USE `employee_tracker`;
-- Questions:
-----------------------------
-- Add a Department. - id, name
-----------------------------
INSERT INTO department(name)
VALUES
    ("security");

-----------------------------
-- Add a Role - id, title, salary, department_id
-----------------------------
INSERT INTO role(title, salary, department_id)
VALUES
("doorman", 1600000, 6);

-----------------------------
-- Add an employee. id, first_name, last_name, role_id, manager_id
-----------------------------
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('richard', 'graves', ?, 1), -- doorman / security

-----------------------------
-- View Departments - show id and name
-----------------------------
SELECT * FROM department;
-----------------------------
-- View roles - show id, title and department name
-----------------------------
SELECT r.id, r.title, d.name 
FROM role r JOIN department d
ON r.department_id = d.id;
-----------------------------
-- View employees - show id, first_name, last_name, role.title, department.name, manager full name
-----------------------------
SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, CONCAT(ee.first_name,' ',ee.last_name) `manager`
FROM employee e JOIN role r ON  e.role_id = r.id                         
JOIN department d ON r.department_id = d.id
JOIN employee ee ON ee.id = e.manager_id
UNION 
SELECT eee.id, eee.first_name, eee.last_name, rr.title, rr.salary, dd.name AS department, eee.manager_id AS manager
FROM employee eee JOIN role rr ON  eee.role_id = rr.id
JOIN department dd ON rr.department_id = dd.id 
WHERE eee.manager_id IS NULL
ORDER BY department;
-----------------------------
-- Update employee role
-----------------------------
UPDATE employee -- table name
SET 
    role_id = ?  -- INT 'new role id'
WHERE 
    id = ?  -- INT 'id from employee'
-----------------------------
-- Update employee manager
-----------------------------
UPDATE employee
SET
    manager_id = ? -- INT  'new manager id'
WHERE
    id = ? -- INT 'id from employee'
-----------------------------
-- View employee by manager
-----------------------------
SELECT  CONCAT(ee.first_name,' ',ee.last_name) `manager`, d.name AS department, e.id, e.first_name, e.last_name, r.title, r.salary
FROM employee e JOIN role r ON  e.role_id = r.id                         
JOIN department d ON r.department_id = d.id
JOIN employee ee ON ee.id = e.manager_id
ORDER BY manager;
-----------------------------
-- Delete department - allow only if there are no employees in that department
-----------------------------
DELETE FROM department
WHERE department.id = ?;
-----------------------------
-- Delete Role - allow only if there are no employees with that role
-----------------------------
DELETE FROM role
WHERE role.id = ?;
-----------------------------
-- Delete employee
-----------------------------
DELETE FROM employee
WHERE employee.id = ?;
-----------------------------
-- View the total utilized budget by department - combined salaries of all employes in that department
-----------------------------
SELECT d.name AS department, ro.budget AS spending_budget
FROM department d JOIN (
		SELECT r.department_id as id, SUM(r.salary) AS budget 
		FROM role r JOIN employee e WHERE e.role_id = r.id
		GROUP BY id) ro
WHERE d.id = ro.id;
-----------------------------
