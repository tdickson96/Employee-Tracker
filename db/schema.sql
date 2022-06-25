DROP DATABASE IF EXISTS company_db;
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

DROP TABLE IF EXISTS department, role, employee;

CREATE TABLE department (
    id      INT         NOT NULL    AUTO_INCREMENT,
    name    VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id              INT             NOT NULL    AUTO_INCREMENT,
    title           VARCHAR(30)     NOT NULL, 
    salary          DECIMAL(30, 2)  NOT NULL,
    department_id   INT             NOT NULL,
    -- make sure to connect role table to department_id in department table
    FOREIGN KEY (department_id) 
        REFERENCES department(id)
            -- if department is deleted, then delete roles in department table
            ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id          INT         NOT NULL    AUTO_INCREMENT,
    first_name  VARCHAR(30) NOT NULL,
    last_name   VARCHAR(30) NOT NULL,
    role_id     INT,
    manager_id  INT,
    -- make sure to connect employee table to role_id in role table
    FOREIGN KEY (role_id) 
        REFERENCES role(id)
            -- if role is deleted, then delete roles in employee table
            ON DELETE SET NULL,
    -- make sure to connect employee table to manager_id in employee table
    FOREIGN KEY (manager_id) 
        REFERENCES employee(id)
            -- set employee's manager to NULL if manager is deleted
            ON DELETE SET NULL
                -- if table is updated, then update in employee table
                ON UPDATE CASCADE,
    PRIMARY KEY (id)
);
