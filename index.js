// 1. SETUP NPM PACKAGES
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");

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

function main(){
  const uri = "mongodb+srv://root:itsnoteasy23@cluster0.jwyovzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  const db = connect(uri, "library-system");
}

// 2. ROUTES
app.get("/", function(req,res){
  res.json({
    "message": "success"
  })
})

// 3. STARTING THE SERVER
app.listen(3001, function(){
  console.log("Server has started")
})