USE `employee_tracker`;

INSERT INTO department(id, name)
VALUES
    (6, "housekeeping"),
    (3, "kitchen"),
    (4, "front of house"),
    (2, "accounting"),
    (5, "marketing"),
    (1, "administration");


INSERT INTO role(id, title, salary, department_id)
VALUES
(2, "head chef", 40000.00, 3),
(5, "sus-chef", 30000.00, 3),
(6, "comi-chef", 26000.00, 3),
(7, "pot-washer", 16000.00, 3),
(3, "restaurant manager", 40000.00, 4),
(8, "restaurant assistant manager", 32000.00, 4),
(9, "head sommelier", 38000.00, 4),
(10, "assistant sommelier", 26000.00, 4),
(11, "head waiter", 26000.00, 4),
(12, "commi-waiter", 19500.00, 4),
(13, "runner", 16000.00, 4),
(14, "chief-accounting", 38000.00, 2),
(15, "junior-accounting", 26000.00, 2),
(16, "marketing manager", 38000.00, 5),
(17, "junior marketeer", 26000.00, 5),
(18, "housekeeping manager", 26000.00, 6),
(19, "housekeeper", 19000.00, 6),
(1, "general manager", 46000.00, 1),
(4, "assistant general manager", 29000.00, 1); 


INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, "eduardo", "neto", 1, NULL), -- general manager / administration
(2, "gina", "gerson", 4, 1),    -- assistant general manager /  administration
(3, "kyle", "minogue", 2 , 1), -- head chef / kitchen
(4, "josh", "menphis", 5, 3), -- us-chef / kitchen
(5, "rick", "south", 6, 3), -- comi-chef / kitchen
(6, "john", "snow", 7, 3), -- pot-washer / kitchen
(7, "rita", "march", 3, 1), -- restaurant manager / front of house
(8, "carl", "hudson", 8, 7), -- restaurant assistant manager / front of house
(9, "rick", "marshal", 9, 1), -- head sommelier / front of house
(10, "paul", "chase", 10, 9), -- assistant sommelier / front of house
(11, "shirley", "temple", 11, 7), -- head waiter / front of house
(12, "richard", "steves", 12, 7), -- commi waiter/ front house
(13, "susanne", "malik", 13, 7), -- runner / front house
(14, "paulinne", "summers", 14, 1), --  chief accounting / accounting
(15, "mark", "douglas", 15, 14), -- junior accounting / accounting
(16, "cally", "shortbread", 16, 1), -- marketing manager / marketing
(17, "paul", "goudard", 17, 16), -- junior marketer / marketing
(18, "carly", "stuart", 18, 1), -- housekeeping manager / housekeeping
(19, "bernard", "bromsfield", 19, 18); -- housekeeper / housekeeping