// 1. SETUP NPM PACKAGES
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
require.apply("dotenv").config();

// Setting up a Mongo Client
const MongoClient = mongodb.MongoClient;

// create an express application
const app = express();

// enable cors (for RESTful API)
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connect(uri, dbname){
  const client = await MongoClient.connect(uri,{
    useUnifiedTopology: true
  });
  let db = client.db(dbname);
  return db;
}

async function main(){
  const uri = process.env.MONGO_URI
  const db = await connect(uri, "sample_mflix");
  
  // 2. ROUTES
  app.get("/", async function(req,res){

    // get the first 10 movies
    const results = await db.collection("movies").find({}).limit(10).toArray()
    
    res.json({
      "movies": results
    })
  })
}

main();

// 3. STARTING THE SERVER
app.listen(3001, function(){
  console.log("Server has started")
})