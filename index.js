// 1. SETUP NPM PACKAGES
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
require("dotenv").config();

// Setting up a Mongo Client
const MongoClient = mongodb.MongoClient;

// Shortcut to mongodb.ObjectId
const ObjectId = mongodb.ObjectId

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
  const db = await connect(uri, "library_system");
  
  // 2. ROUTES
  app.get("/all-books", async function(req,res){
    try {
      // empty search criteria
      const criteria = {}

      if(req.query.name) {
        criteria.name = {
          "$regex": req.query.name,
          "$options": 'i' // ignore case
        }
      } 

      // CAN ADD SEARCH FOR AUTHOR 

      const results = await db.collection("books").find(criteria).toArray()

      res.json({
        "books": results
      })
    } catch (e) {
      res.send(500);
      res.json({
        "error": e
      })
    }
  })

  // Sample Book to be Created
  // {
  //   "_id": ObjectId();
  //   "isbn_ten": "1544536828",
  //   "isbn_thirteen": "978-1544536828",
  //   "name": "Never Finished: Unshackle Your Mind and Win the War Within",
  //   "version": "Clean Edition",
  //   "date_published": "2022-12-04",
  //   "page_count": 312,
  //   "languages": ["English"],
  //   "author_id": [4002],
  //   "publisher_id": 5002
  // }

  app.post("/all-books", async function(req, res){
    try {
      const isbn_ten = req.body.isbn_ten;
      const isbn_thirteen = req.body.isbn_thirteen; 
      const name = req.body.name;
      const version = req.body.version;
      const date_published = new Date(req.body.date_published) || new Date();
      const page_count = req.body.page_count;
      const languages = req.body.languages;
      const author_id = req.body.author_id;    
      const publisher_id = req.body.publisher_id; 


      // Insert a new document
      const result = await db.collection("books").insertOne({
        "isbn_ten": isbn_ten,
        "isbn_thirteen": isbn_thirteen,
        "name": name,
        "version": version,
        "date_published": date_published,
        "page_count": page_count,
        "languages": languages,
        "author_id": author_id,
        "publisher_id": publisher_id
      });
      res.json({
        "result": result
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })

  app.put("/all-books/:id", async function(req, res){
    try {
      const isbn_ten = req.body.isbn_ten;
      const isbn_thirteen = req.body.isbn_thirteen; 
      const name = req.body.name;
      const version = req.body.version;
      const date_published = new Date(req.body.date_published) || new Date();
      const page_count = req.body.page_count;
      const languages = req.body.languages;
      const author_id = req.body.author_id;    
      const publisher_id = req.body.publisher_id; 

      result = await db.collection("books").updateOne({
        "_id": ObjectId,
      },{
        "$set": {
          "isbn_ten": isbn_ten,
          "isbn_thirteen": isbn_thirteen,
          "name": name,
          "version": version,
          "date_published": date_published,
          "page_count": page_count,
          "languages": languages,
          "author_id": author_id,
          "publisher_id": publisher_id
        }
      })
      res.json({
        "result": result 
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })

  app.delete("all-books/:id", async function(req, res){
    await db.collection("books").deleteOne({
      "_id": new ObjectId(req.params.id)
    });

    res.json({
      "message": "Deleted"
    })
  })
}

// try {

// } catch (e) {
//   res.status(500);
//   res.json({
//     "error": e
//   })
// }

main();

// 3. STARTING THE SERVER
app.listen(3001, function(){
  console.log("Server has started")
})