# Froker Backend Project

This provides instructions on how to run the Froker Backend Project locally on your machine. 
Utilised Express.js for the backend and MongoDB for the database, used Bcrypt for password hashing and JWT for authentication.
Also attached are screenshots of the API being tested using Postman.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- MongoDB

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install the project dependencies by running:

```sh
npm install
```

## Configuration

Create a .env file in the root of your project directory and add the following configurations:

```sh
DB_URL=mongodb://localhost:27017/Froker-backend
JWT_SECRET=your_jwt_secret
```

## Running the Project
```sh
node app.js
```

## Testing the API

### Registering a User: ```POST localhost:3000/api/signup```
![Screenshot of /signup](/test_screenshots/Register_success.png)

### Validations for signup
![Screenshot of /signupfail1](/test_screenshots/Register_fail1.png)
![Screenshot of /signupfail2](/test_screenshots/Register_fail2.png)

### Logging in a User: ```POST localhost:3000/api/login```
![Screenshot of /login](/test_screenshots/Login.png)

### Fetching user details using JWT: ```GET localhost:3000/api/user```
![Screenshot of /user](/test_screenshots/user_details.png)

### Borrowing money: ```POST localhost:3000/api/borrow```
![Screenshot of /borrow](/test_screenshots/borrow.png)

### Updated user details after borrowing money
![Screenshot of /user](/test_screenshots/updated_details.png)

