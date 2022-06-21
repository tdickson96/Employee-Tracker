INSERT INTO department (name)
    VALUES ("Management"), ("Sales"), ("Marketing"), ("Human Resources") 

INSERT INTO role (title, salary, department_id)
    VALUES ("Chief Executive Officer", 2000000, 1),
    ("Project Manager", 100000, 1),
    ("Salesperson", 1000000, 2),
    ("Sales Person", 90000, 2),
    ("Digital Marketer", 80000, 3),
    ("Online Marketer", 75000, 3),
    ("Human Resource Administrator", 70000, 4),
    ("Human Resource Documenter", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Atlas", "Bunson", 1, NULL),
    ("Candy", "Donald", 2, 1),
    ("Edward", "Fredward", 3, 1),
    ("Gerald", "Hunter", 4, 1),
    ("Idris", "Jackson", 5, NULL),
    ("Kendrick", "Lamar", 6, 1),
    ("Money", "Never", 7, 1),
    ("Ophelia", "Purple", 8, 1);
