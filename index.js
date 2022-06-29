// import inquirer, console.table and mysql
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const departments = [];
const roles = [];
const managers = [{name: "Atlas Bunson", value: 1}, {name: "Idris Jackson", value: 5}];
const employees = [];

const ALL_DEPARTMENTS = 'View all Departments';
const ALL_ROLES = 'View all Roles';
const ALL_EMPLOYEES = 'View all Employees';
const NEW_DEPARTMENT = 'Add a new Department';
const NEW_ROLE = 'Add a new Role';
const NEW_EMPLOYEE = 'Add a new Employee';
const UPDATE_EMPLOYEE = 'Update An Employee Role';
const EXIT_PROMPT = 'Exit Prompt';

// create connection to mysql database (company_db)
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'dickson',
    database: 'company_db'
  },
  console.log('--- Connected to the company_db database! ---')
);

// puts existing departments into the departments array
db.query("SELECT name FROM department", function (err, res) {
  if (err) throw err;

  res.forEach(department => {
      departments.push(department.name);
  });
});

// puts existing roles into the roles array
db.query("SELECT title FROM role", function (err, res) {
  if (err) throw err;

  res.forEach(role => {
      roles.push(role.title);
  });
});

// inquirer prompts
function employeeTracker() {
  inquirer.prompt([{
    type: "list",
    name: "viewAll",
    message: "What would you like to do?",
    choices: 
    [
      ALL_DEPARTMENTS,
      ALL_ROLES,
      ALL_EMPLOYEES,
      NEW_DEPARTMENT,
      NEW_ROLE,
      NEW_EMPLOYEE,
      UPDATE_EMPLOYEE,
      EXIT_PROMPT
    ]
  }])
  .then((data) => {
    if (data.viewAll === ALL_DEPARTMENTS) {
        viewDepartments();
    } else if (data.viewAll === ALL_ROLES) {
        viewRoles();
    } else if (data.viewAll === ALL_EMPLOYEES) {
        viewEmployees();
    } else if (data.viewAll === NEW_DEPARTMENT) {
        newDepartment();
    } else if (data.viewAll === NEW_ROLE) {
        newRole();
    } else if (data.viewAll === NEW_EMPLOYEE) {
        newEmployee();
    } else if (data.viewAll === UPDATE_EMPLOYEE) {
        updateEmployee();
    } else if (data.viewAll === EXIT_PROMPT) {
        console.log("--- Exiting this application ---");
        exit();
    }
  })
};

// viewDepartments()
function viewDepartments() {
  db.query('SELECT department.id AS Department_ID, department.name AS Department_Name FROM `department`', 
            function (err, res) {
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
  db.query('SELECT role.id AS Role_ID, role.title AS Role_Title, role.salary AS Salary, department.name AS Department_Name FROM `role` INNER JOIN department ON role.department_id = department.id',
            (err, res) => {
    if (err) {
      throw err;
    } else {
      console.table(res);
    }
    employeeTracker();
  });
}

// viewEmployees()
function viewEmployees() {
  db.query('SELECT employee.id AS Employee_ID, CONCAT(employee.first_name, " " , employee.last_name) AS Employee_Name, role.title AS Employee_Title, role.salary AS Employee_Salary, CONCAT(e2.first_name, " ", e2.last_name) AS Employee_Manager FROM `employee` INNER JOIN role ON employee.role_id = role.id LEFT JOIN employee as e2 ON e2.id = employee.manager_id',
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
      message: "What is the name of the new Department",
      name: "new_department"
  }])
  .then(function(answer) {
    console.log(answer);
      db.query('INSERT INTO department SET ?', {
              name: answer.new_department
          },
          function (err) {
              if (err) throw err;
              console.log(`--- The department "${answer.new_department}" has been added. ---`);
              departments.push(answer.new_department);

              employeeTracker();
          }
      );
  });
}

// newRole()
function newRole() {
  inquirer.prompt([{
      type: "list",
      name: "department",
      message: "What Department will this Role fit into?",
      choices: departments
  }, {
      type: "input",
      name: "title",
      message: "What is the title of this Role?",
  }, {
      type: "number",
      name: "salary",
      message: "What is the salary for this new role?",
  }])
  .then(role => {
      db.query(`SELECT id 
                FROM department 
                WHERE (department.name= "${ role.department }")`, 
                function (err, res) {
          if (err) throw err;

          db.query("INSERT INTO role SET ?", {
                  title: role.title,
                  salary: role.salary,
                  department_id: res[0].id
              },
              function (err) {
                  if (err) throw err;
                  console.log(`--- "${role.title}" has been added to "${role.department}". The salary of "${role.title}" is "${role.salary}." ---`);
                  roles.push(role.title);
                  employeeTracker();
              });

      });
  });
}

// newEmployee()
function newEmployee() {
  inquirer.prompt([{
          type: "input",
          message: "What is the employee's first name?",
          name: "firstName"
      }, {
          type: "input",
          message: "What is the employee's last name?",
          name: "lastName"
      }, {
          type: "list",
          message: "What is the employee's role?",
          choices: roles,
          name: "role"
      }, {
          type: "list",
          message: "Who is their manager?",
          choices: managers,
          name: "manager"
      }

  ]).then(employee => {
      employeeFirstName = employee.firstName;
      employeeLastName = employee.lastName;
    
      console.log(employee);

        db.query(`SELECT id FROM role WHERE (role.title = "${ employee.role }")`, 
          function (err, res) {
            if (err) throw err;

          db.query("INSERT INTO employee SET ?", {
                  first_name: employee.firstName,
                  last_name: employee.lastName,
                  role_id: res[0].id,
                  manager_id: employee.manager 
          },

          function (err) {
              if (err) throw err;
              console.log("The employee was added to the database.");
              employeeTracker();
          })
       });
  });
}

// function is called when UPDATE EMPLOYEE is chosen
function updateEmployee() {
  let employees = [];

  db.query(`SELECT first_name, last_name FROM employee`, function (err, res) {
      if (err) throw err;

      console.log("------1-------");

      employeesList = res.map(employee => {
          return `${employee.first_name} ${employee.last_name}`
      })

      console.log("------2-------");

      inquirer.prompt([{
          type: "list",
          message: "Who's role would you like to update?",
          choices: employeesList,
          name: "employees"
      }, {
          type: "list",
          message: "What do you want to assign?",
          choices: roles,
          name: "role"
      }])
      .then(response => {});

      console.log("------3-------");
  });
};

function exit() {
  db.end();
  process.exit();
}

// Run inquirer questions function to start prompt, promises, and user inputs
employeeTracker();
