Documentation Reference: https://github.com/nadialefebvre/library

# Library System Database

This project was built as a means to learn ExpressJS in conjunction with Mongo Atlas (10 March 2023).

## Overview
This simple Javascript server acts as a basic library managemement system, allowing users to manage a collection of books. Users will be able to perform CRUD (Create, Delete, Update, Delete) operations on the books through a set of RESTFUL API endpoints. This application was built using the ExpressJS framework and utilises a Mongo Database for database interactions.

Here is a simple entity relationship diagram of the library system
![alt text](assets/library-erd.png)

## Getting Started

To run the Library System server,

1. Install the following packages from Node.JS (Express, CORS, DotEnv and MondoDB)
```
npm install express cors dotenv mongodb
```

2. Install Node Monitor
```
npm install -g nodemon
```

3. Start the server using Node Monitor
```
nodemon
```

The server will start and the API endpoints may be reached using tools such as Advanced REST Client (ARC), Postman or Insomnia

## Configuration and Environment Variables
Before running the server, ensure that the following are setup in a `.env` file. Please refer to the `.env.sample` file for the variables required.
1. **Mongo URI**: This is your connection string from Mongo Atlas. To retrieved your connection string, do the following: Log in to Mongo Atlas > Database > Connect > Drivers (Node.JS) > Copy connection string from section 3.
2. **MongoDB Name**: This is the name of the mongo database that will store the book information. Create a new database in `Mongo Atlas` or select a new database name by keying it in a `.env` file. An example of a database name is *library-books*.
3. **Token Secret**: This is the private key used to generate a hash for users' password. You could generate a random key via `https://randomkeygen.com/` (use the 504-bit WPA key for best security).

## API Endpoints
The following API endpoints are available to perform the CRUD operations.

### Books
* `GET /books` : Retrieve information of all books
* `POST /books` : Create a new book
* `PUT /books/{bookid}` : Update details of an existing book
* `DELETE /books/{bookid}` : Delete an existing book

### Users
* `POST /user` : Create a new user
* `POST /login` : Generate JSONWebToken via user login (expires in 3 days)
* `POST /profile` : Access protected route via valid JSONWebToken

## Example Usage
Here are some examples of how you can interact with the API and how it will be logged in MongoDB.

*Note: The endpoint for books in the screenshots differs from the actual endpoint. Please use the `/books` endpoint!*

### Books 
* Retrieve information of all books
```
GET http://localhost:3001/books
```
Successful retrival of book information in ARC:
![alt text](assets/read-books.png)

Book information stored in MongoDB:
![alt text](assets/read-books-db.png)

Search by author:
![alt text](assets/search-author.png)

Search by language:
![alt text](assets/search-language.png)

Search by publisher:
![alt text](assets/search-publisher.png)

Search by title:
![alt text](assets/search-title.png)

* Create a new book
```
POST http://localhost:3001/books
```
Successful creation of new book in ARC:
![alt text](assets/create-books.png)

New book information stored in MongoDB:
![alt text](assets/create-books-db.png)

Validation of ISBN entered:
![alt text](assets/validation-isbn.png)

Validation of languages and authors entered:
![alt text](assets/validation-array.png)

Validation of publisher ID entered:
![alt text](assets/validation-publisherid.png)

Validation of other information entered:
![alt text](assets/validation-all-info.png)

* Update details of an existing book
```
PUT http://localhost:3001/books/{bookid}
```
Successful update of existing book information in ARC:
![alt text](assets/update-books.png)

Existing book information (before updating languages) stored in MongoDB:
![alt text](assets/create-books-db.png)

Existing book information (after updating languages) stored in MongoDB:
![alt text](assets/update-books-db.png)

*Note: Validation performed when updating a book information is the same as that when a new book is created*

* Delete an existing book
```
DELETE http://localhost:3001/books/{bookid}
```
Successful deletion of existing book information in ARC:
![alt text](assets/delete-books.png)

Existing book information (before deletion) stored in MongoDB:
![alt text](assets/delete-books-db-before.png)

Existing book information (after deletion) stored in MongoDB:
![alt text](assets/delete-books-db-after.png)

### Users
* Create a new user
```
POST http://localhost:3001/user
```
Successful creation of new user in ARC:
![alt text](assets/create-users.png)

New user information stored in MongoDB:
![alt text](assets/create-users-db.png)

* Generate JSONWebToken via user login (expires in 3 days)
```
POST http://localhost:3001/login
```
Successful user login and generation of JSONWebToken in ARC:
![alt text](assets/login-users.png)

* Access protected route via valid JSONWebToken
```
POST http://localhost:3001/profile
```
Valid JSONWebToken used to access protected route in ARC:
![alt text](assets/authorise-users.png)

Invalid JSONWebToken used to access protected route in ARC:
![alt text](assets/unauthorise-users.png)

## Technological Stacks Used
* JavaScript
* NPM Packages (Express, CORS, DotEnv, bcrypt, JSONWebToken)
* Mongo Atlas Database