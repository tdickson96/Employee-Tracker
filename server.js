// import express, inquirer, and mysql
const express = require('express');
// import inquirer from 'inquirer';
const inquirer = require('inquirer');
const mysql = require('mysql2');
// create and require connection
const sequelize = require('./connection/connection');

// hosting environment
const PORT = process.env.PORT || 3001;

// express init
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// 

// listen for port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });