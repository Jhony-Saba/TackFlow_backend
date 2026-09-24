const mongoose = require('mongoose');
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "1.0.0.1"]);





const uri = process.env.URI

const connectDB  =async()=>{
try {
  const connect = await mongoose.connect(uri)
  console.log("Database connected",
    connect.connection.name,
    connect.connection.host,
  
  )
  return 1
} catch (error) {
  console.error("error",uri)
  return 0
  
}


}


module.exports =connectDB


