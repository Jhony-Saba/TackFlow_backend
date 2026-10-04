/*Imports the Express framework.
 Used to create the backend server and API routes.*/
 const express = require("express");
/*Imports the CORS middleware.
Because ports are different, browsers consider them different origins.
*Without CORS:
Access blocked by browser
*Why we use it
Allows frontend to call backend APIs.*/
const cors = require("cors");
/*Load Environment Variables
*What it does
Loads values from .env file.
*Why we use it
To hide sensitive information.*/
require("dotenv").config();
//Imports a custom error handler middleware.
const erroHandler =require("./middleware/erroHandler");
//DNS SERVIECE 
const dns = require("node:dns/promises");
//Import DataBase connection    
const connectDB = require("./config/db");

dns.setServers(["1.1.1.1", "1.0.0.1"]);
//Creates an Express app.
const app = express();
//PORT of my backend 
const PORT = process.env.PORT || 8000 ; 
/**
* Enable Cross-Origin Resource Sharing (CORS).
* Allows frontend applications hosted on different origins
* to communicate with this API.
*/
app.use(cors());
/**
* Parse incoming JSON request bodies.
* Makes JSON data available through req.body.
*/
app.use(express.json());// Parse incoming JSON request bodies.
/**
* Register user-related routes.
* Base path: /user
*/
app.use("/user",require("./routes/userRoute"));//User-related routes
/**
* Register project-related routes.
* Base path: /project
*/
app.use("/project", require("./routes/projectRoute"));//Project-related routes
/**
* Register task-related routes.
* Base path: /task
*/
app.use("/task", require("./routes/taskRoute"));//Task-related routes
/**
* Global error-handling middleware.
* Must be registered after all routes and middleware
* so it can catch and process application errors.
*/
app.use(erroHandler);//apply this errorhandler after calling the routes

/**
* Starts the application.
*
* Workflow:
* 1. Connect to the database.
* 2. Start the Express server if the connection succeeds.
* 3. Log an error message otherwise.
*
* @returns {Promise<void>}
*/
const run =async()=>{
     if( await connectDB()==1)//check if the connection to database in done [1] or not [0]
      await app.listen(PORT,()=> {
      console.log(`Server running on http://localhost:${PORT}`);
})
      else console.log("connection  error invalid Server ")
}
run();



