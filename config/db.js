const mongoose = require('mongoose');
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);





const connectDB  =async()=>{
try {
  const uri = process.env.URI
  if (!uri) {
    throw new Error("The URI environment variable is not set")
  }

  const connect = await mongoose.connect(uri)
  console.log("Database connected",
    connect.connection.name,
    connect.connection.host,
  
  )
  return 1
} catch (error) {
  console.error("Database connection failed:", error.message)
  return 0
  
}


}


module.exports =connectDB


