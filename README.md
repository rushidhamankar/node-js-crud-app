# node-js-crud-app
Hi folks in this file I have mentioned steps to run this projects on your local system.

step 1: first configure your database to our app by puting your local system mysql credentials in db.js file which present on path rootFolder/lib/db.js

step 2: then fire below list of commands in your mysql shell prompt
A) create database test;
B) use database test;
C) CREATE TABLE `category` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `category_id` varchar(100) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );
D) CREATE TABLE product (
   id INT PRIMARY KEY auto_increment,
   product_id VARCHAR(100) NOT NULL,
   product_name VARCHAR(100) NOT NULL,
   category_id varchar(100) NOT NULL );
   
step 3 : then fire below commands in root directory of this project
A) npm install
B) npm start
