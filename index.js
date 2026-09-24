const express = require("express");
const cors = require("cors");
require("dotenv").config();
const erroHandler =require("./middleware/erroHandler");//Imports a custom error handler middleware.
const dns = require("node:dns/promises");//DNS SERVIECE     
const connectDB = require("./config/db");//DataBase connection
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();//Creates an Express app.
const PORT = process.env.PORT || 8000 ; //PORT of my backend 

app.use(cors());
app.use(express.json());//Parses incoming JSON requests.
app.use("/user",require("./routes/userRoute"));//User-related routes
app.use("/project", require("./routes/projectRoute"));//Project-related routes
app.use("/task", require("./routes/taskRoute"));//Task-related routes

app.use(erroHandler);//apply this errorhandler after calling the routes


const run =async()=>{
     if( await connectDB()==1)//check if the connection to database in done [1] or not [0]
     await app.listen(PORT,()=> {
      console.log(`Server running on http://localhost:${PORT}`);
})
      else console.log("connection  error invalid Server ")
}
run();



