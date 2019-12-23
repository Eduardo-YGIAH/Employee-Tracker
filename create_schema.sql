SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP DATABASE IF EXISTS `employee_tracker`;

CREATE DATABASE IF NOT EXISTS `employee_tracker`
DEFAULT CHARACTER SET utf8;

USE `employee_tracker`;

DROP TABLE IF EXISTS `employee_tracker`.`department`;

CREATE TABLE IF NOT EXISTS `employee_tracker`.`department` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `employee_tracker`.`role`;

CREATE TABLE IF NOT EXISTS `employee_tracker`.`role` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `salary` DECIMAL NOT NULL,
    `department_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `department_id` (`department_id` ASC),
    CONSTRAINT `department_id`
    FOREIGN KEY (`department_id`)
    REFERENCES `employee_tracker`.`department` (`id`)
);

DROP TABLE IF EXISTS `employee_tracker`.`employee`;

CREATE TABLE IF NOT EXISTS `employee_tracker`.`employee` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL,
    `role_id` INT NOT NULL,
    `manager_id` INT REFERENCES `employee_tracker`.`employee` (`id`),
    PRIMARY KEY (`id`),
    INDEX `role_id` (`role_id` ASC),
    INDEX `manager_id` (`manager_id` ASC),
    CONSTRAINT `role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `employee_tracker`.`role` (`id`)
 --   CONSTRAINT `manager_id`
 --   FOREIGN KEY (`manager_id`)
 --   REFERENCES `employee_tracker`.`employee` (`id`)
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;