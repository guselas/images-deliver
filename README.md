# ImagesDeliver

This is a project a technical trial

### Pre-requirements 📋

You need access to a Mongo database (see: https://docs.mongodb.com/manual/installation/)


## Starting 🚀

To start this project, do the following:

1- in a terminal do: git clone https://github.com/guselas/images-deliver.git

2- type: cd ImagesDeliver

3- type: npm install


## To start the app

in terminal type: npm run start

This will create a server for localhost:3000 and a connection to a mongoDB database. 

Use postman to use this api:

1- POST http://localhost:3000/task   body: file:file

 example:
![Screenshot](./postmanCollection/examples/Captura%20de%20pantalla%202023-03-14%20a%20las%2015.13.42.png)


2- GET http://localhost:3000/task/:id 

 example: 
![Screenshot](./postmanCollection/examples/Captura%20de%20pantalla%202023-03-14%20a%20las%2015.14.19.png)


3- GET http://localhost:3000/task/:id/original

 example: 
![Screenshot](./postmanCollection/examples/Captura%20de%20pantalla%202023-03-14%20a%20las%2015.16.37.png)


## Build with 🛠️

* Node.js - cross-platform runtime environment
* Express - Node framework designed for building web applications and APIs
* Mongoose - Mongo ORM
* Multer - make easier to work with files
* Sharp - high performance image processing library for Node.js
* crypto - a Core module from Node.js to make easier encryption
* Jest and Supertest - to develop the testing area (Jest for unitary tests and Supertest for endpoint work)


## Author ✒️

* Fernando Ruiz  Git: (https://github.com/guselas)
