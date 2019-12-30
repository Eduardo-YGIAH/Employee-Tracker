# Employee Tracker

A Content Management System for managing a company's employees using node, inquirer, and MySQL.

## What you can do:

- Add departments, roles, employees
- View departments, roles, employees
- Update employee roles
- Update employee managers
- View employees by manager
- Delete departments, roles, and employees
- View the total utilized budget of a department

## Preview

[![Video - Preview](https://res.cloudinary.com/ygiah/image/upload/v1577747087/bootcamp/employee_tracker/Screenshot_2019-12-30_at_23.01.25.png)](https://res.cloudinary.com/ygiah/video/upload/v1577747423/bootcamp/employee_tracker/demo.mp4)

**[Click To View Live Preview](https://res.cloudinary.com/ygiah/video/upload/v1577747423/bootcamp/employee_tracker/demo.mp4)**

## How to use

### Clone the repository to your computer

- Change the current working directory to the location where you want the cloned directory to be made.

- Type git clone, and then paste the URL like:

```
$ git clone https://github.com/Eduardo-YGIAH/Employee-Tracker.git

```

### Install dependecies shown on package.json

```
  "dependencies": {
    "console.table": "^0.10.0",
    "express": "^4.17.1",
    "figlet": "^1.2.4",
    "inquirer": "^7.0.1",
    "mysql": "^2.17.1"
  },
  "devDependencies": {
    "env-cmd": "^10.0.1"
  }

```

### Create a config folder and dev.env file inside

- Add to dev.env the necessary credentials

```
PORT=YOUR_CHOSEN_PORT
DATABASE_PASSWORD=YOUR_PASSWORD

```

### Make sure the start scripts in the package.json file are correct

```
  "scripts": {
    "start": "node server.js",
    "dev": "./node_modules/.bin/env-cmd -f ./config/dev.env node server.js"
  }

```

### Create database, example uses MySQL Workbench

[![Create Database - Preview](https://res.cloudinary.com/ygiah/image/upload/v1577741691/bootcamp/employee_tracker/creating_database.gif)](https://res.cloudinary.com/ygiah/image/upload/v1577741691/bootcamp/employee_tracker/creating_database.gif)

### Populate database with dummy data or replace values with your own

[![Populate Database with dummy data - Preview](http://www.tutorials.yougetitathome.com/c84fd6369b4a/Screen%252520Recording%2525202019-12-30%252520at%25252009.39%252520pm.gif)](http://www.tutorials.yougetitathome.com/c84fd6369b4a/Screen%252520Recording%2525202019-12-30%252520at%25252009.39%252520pm.gif)

### Test application by running

```
npm run dev

```
