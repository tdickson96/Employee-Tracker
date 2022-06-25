// import inquirer, console.table and mysql
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// create connection to mysql database (business_db)
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'dickson',
    database: 'company'
  },
  console.log('--- Connected to the company_db database! ---')
);

// inquirer prompts
employeeTracker = () => {
  inquirer.prompt([{
    type: "list",
    name: "starter_questions",
    message: "What would you like to do?",
    choices: 
    [
      "View all Departments",
      "View all Roles",
      "View all Employees",
      "Add a new Department",
      "Add a new Role",
      "Add a new Employee",
      "Update an Employee Role",
      "Exit this Prompt"
    ]
  }])
  .then((response) => {
    // based on user answers, give functions
    switch(response.starter_questions) {
      case "View all Departments": 
            viewDepartments();
      break;
      case "View all Roles": 
            viewRoles();
      break;
      case "View all Employees": 
            viewEmployees();
      break;
      case "Add a new Department": 
            newDepartment();
      break;
      case "Add a new Role": 
            newRole();
      break;
      case "Add a new Employee": 
            newEmployee();
      break;
      case "Update an Employee Role": 
            updateEmployeeRole();
      break;
      case "Exit this Prompt":
            exitPrompt();
      // Exit prompt
    }
  })
}

// viewDepartments()
function viewDepartments() {
  db.query(`SELECT department.id 
            AS Department_ID, 
            department.name 
            AS Department_Name 
            FROM department;`, 
            (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res)
    }
    employeeTracker();
  });
}

// viewRoles()
function viewRoles() {
  db.query(`SELECT role.id 
            AS Role_ID, 
            role.title 
            AS Role_Title, 
            role.salary 
            AS Role_Salary, 
            department.name 
            AS Role_Department_Name 
            FROM role 
            INNER JOIN department 
            ON role.department_id = department.id;`,
            (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res)
    }
    employeeTracker();
  });
}

// viewEmployees()
function viewEmployees() {
  db.query(`SELECT employee.id AS Employee_ID,
            CONCAT(employee.first_name, " ", employee.last_name)
            AS Employee_Name
            role.salary AS Employee_Salary,
            CONCAT(employee2.first_name, " ", employee2.last_name)
            AS Employee_Manager
            FROM employee 
            INNER JOIN role 
            ON employee.department_id = employee.id
            LEFT JOIN employee as employee2 on employee2.id = employee.manager_id;`,
            (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res)
    }
    employeeTracker();
  });
}

// newDepartment()
function newDepartment() {
  inquirer.prompt([{
    type: "input",
    message: "What would you like to call the new Department?",
    name: "new_department"
  }])
  .then((input) => {
    db.query('INSERT INTO department SET ?', {name: input.new_department}, (err,res) => {
      if (err) throw err;
      employeeTracker();
    });
  });
}

// newRole()
function newRole() {
  inquirer.prompt([{
    type: "input",
    message: "What would you like to call the new Role?",
    name: "role"
  }])
  .then((input) => {
    db.query('INSERT INTO role SET ?', 
            {name: input.role}, 
            (err,res) => {
      if (err) throw err;
      employeeTracker();
    });
  });
}

// newEmployee()
function newEmployee() {
  inquirer.prompt([{
    type: "input",
    message: "What would you like to call the new Employee?",
    name: "role"
  }])
  .then((input) => {
    db.query('INSERT INTO role SET ?', 
            {name: input.employee}, 
            (err,res) => {
      if (err) throw err;
      employeeTracker();
    });
  });
}


// updateEmployeeRole()
function updateEmployeeRole() {
  db.query(`SELECT role.id AS Role_ID, 
            role.title AS Role_Title, 
            role.salary AS Role_Salary, 
            department.name AS Role_Department_Name 
            FROM role 
            INNER JOIN department 
            ON role.department_id = department.id;`,
            (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res)
    }
    employeeTracker();
  });
}

// exitPrompt()
function exitPrompt() {
  process.exit();
}

// Run inquirer questions function to start prompt, promises, and user inputs
employeeTracker();