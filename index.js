// 1. SETUP NPM PACKAGES
const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// GENERATE A JSONWEBTOKEN
function generateAccessToken(id, email) {
  return jwt.sign({
    // Payload to be stored
    "user_id": id,
    "email": email,
  }, process.env.TOKEN_SECRET, { // Private key to hash payload
    "expiresIn": "3d" // JWT expires in 3 days
  });
}

// MIDDLEWARE TO CHECK IF VALID JWT IS PROVIDED
function authenticateWithJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(
        token, 
        process.env.TOKEN_SECRET, 
        function(err, payload){
          if (err) {
            res.status(400);
            return res.json({
              "error": err
            })
          } else {
            // Valid JWT - Forward request to route, and store payload in the request
            req.payload = payload;
            next();
          }
      })
    } else {
      res.status(400);
      res.json({
        "error": "Login required to access this route"
      })
    }
  } catch (e) {
    res.send(500);
    res.json({
      "error": e
    })
  }
}

async function main(){
  // Connect to MongoDB
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);
  console.log("Connection to Mongo is successful")
  
  // 2. ROUTES
  app.get("/api", function(req, res){
    res.json({
      "message": "API is running"
    })
  })

  // READ ALL BOOKS
  // QUERY: 
  // 1. BOOK TITLE, 
  // 2. AUTHOR,
  // 3. LANGUAGE, AND 
  // 4. PUBLISHER
  app.get("/books", async function(req,res){
    try {
      // empty search criteria
      const criteria = {}

      // Search by book name
      if(req.query.title) {
        criteria.title = {
          "$regex": req.query.title,
          "$options": 'i' // ignore case
        }
      }

      // Search by author
      if(req.query.author) {
        criteria.author = {
          "$in": [req.query.author]
        }
      }

      // Search by language
      if(req.query.language) {
        criteria.language = {
          "$in": [req.query.language]
        }
      }

      // Search by publisher
      if(req.query.publisher) {
        const publisherArray = await db.collection("publishers").find({
          name: {
            "$regex": req.query.publisher,
            "$options": 'i' // ignore case
          }
        }).toArray();
        console.log(publisherArray[0]._id)
        let publisherId = publisherArray[0]._id;
        criteria.publisher_id = publisherId;
      }

      const results = await db.collection("books").find(criteria).toArray();

      res.json({
        "books": results
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })

  // CREATE A NEW BOOK
  // Sample Book to be Created
  // {
  //   "_id": ObjectId();
  //   "isbn_ten": "1544536828",
  //   "isbn_thirteen": "978-1544536828",
  //   "title": "Never Finished: Unshackle Your Mind and Win the War Within",
  //   "version": "Clean Edition",
  //   "date_published": "2022-12-04",
  //   "page_count": 312,
  //   "language": ["English"],
  //   "author": ["David Goggins"],
  //   "publisher_id": ObjectId()
  // }
  app.post("/books", async function(req, res){
    try {
      const {
        isbn_ten, 
        isbn_thirteen, 
        title, 
        version, 
        date_published, 
        page_count, 
        language, 
        author, 
        publisher_id
      } = req.body;

      // Validation of Entries
      if (!isbn_ten || !isbn_thirteen) {
        res.status(400);
        res.json({
          "error": "Please provide the ISBN"
        })
        return;
      }

      if (!title || !version || !date_published || !page_count) {
        res.status(400);
        res.json({
          "error": "Please provide all information of the book (Title, Version, Date Published and Page Count"
        })
        return;
      }

      if (!language || !Array.isArray(language) || 
          !author || !Array.isArray(author)) {
            res.status(400);
            res.json({
              "error": "Please provide the language and/or author. These fields should be an array."
        })
        return;
      }

      if (!publisher_id || typeof publisher_id != "object") {
        res.status(400);
        res.json({
          "error": "Please provide the publisher id. This field should be an object (with key-value as follow: '$oid': <MongoDB ObjectID>)"
        })
        return;
      }
            
      const newBook = {
                isbn_ten, 
                isbn_thirteen, 
                title, 
                version, 
                date_published : new Date(date_published), // stores a date object 
                page_count, 
                language, 
                author, 
                publisher_id
              };

      // Insert a new document
      const result = await db.collection("books").insertOne(newBook);
      res.json({
        result
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })

  // UPDATE A BOOK
  app.put("/books/:bookid", async function(req, res){
    try {
      const bookId = req.params.bookid;

      const {
        isbn_ten, 
        isbn_thirteen, 
        title, 
        version, 
        date_published, 
        page_count, 
        language, 
        author, 
        publisher_id
      } = req.body;

      // Validation of Entries
      if (!isbn_ten || !isbn_thirteen) {
        res.status(400);
        res.json({
          "error": "Please provide the ISBN"
        })
        return;
      }

      if (!title || !version || !date_published || !page_count) {
        res.status(400);
        res.json({
          "error": "Please provide all information of the book (Title, Version, Date Published and Page Count"
        })
        return;
      }

      if (!language || !Array.isArray(language) || 
          !author || !Array.isArray(author)) {
            res.status(400);
            res.json({
              "error": "Please provide the language and/or author. These fields should be an array."
        })
        return;
      }

      if (!publisher_id || typeof publisher_id != "object") {
        res.status(400);
        res.json({
          "error": "Please provide the publisher id. This field should be an object (with key-value as follow: '$oid': <MongoDB ObjectID>)"
        })
        return;
      }

      const modifiedBook = {
        isbn_ten, 
        isbn_thirteen, 
        title, 
        version, 
        date_published : new Date(date_published), // stores a date object 
        page_count, 
        language, 
        author, 
        publisher_id
      };

      result = await db.collection("books").updateOne({
        "_id": new ObjectId(bookId),
      },{
        "$set": modifiedBook
      });
      res.json({
        result
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })

  // DELETE A BOOK
  app.delete("/books/:bookid", async function(req, res){
    try {
      const bookId = req.params.bookid;
      const result = await db.collection("books").deleteOne({
        "_id": new ObjectId(bookId)
      });
  
      res.json({
        "deleted": result
      })
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }

  })

  // USERS SIGN UP
  // CREATE NEW USER (PASSWORD IS HASHED WITH BCRYPT)
  app.post("/user", async function(req, res){
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const result = await db.collection("users").insertOne({
        "email": req.body.email, 
        "password": hashedPassword
      })
      res.json({
        result
      })
    } catch(e) {
      res.status(500);
      res.json({
        "error": e
      })
    }

  })

  // USER LOG IN
  app.post("/login",async function(req, res){
    try {
      // Find users by their email address
      const user = await db.collection("users").findOne({
        "email": req.body.email
      })

      // Check if their password matches
      if (user) { // If user exists
        if (await bcrypt.compare(req.body.password, user.password)){
          // Valid login - generate JWT
          const token = generateAccessToken(user._id, user.email);
          res.json({
            token
          })
        } else {
          res.status(400);
          res.json({
            "error": "Invalid login credentials"
          })
        }
      } else { // If user do not exist
        res.status(400);
        res.json({
          "error": "Invalid login credentials"
      })
      }
      // Generate and send back JWT
    } catch (e) {
      res.status(500);
      res.json({
        "error": e
      })
    }
  })
  
  // PROTECTED ROUTE (REQUIRES JWT FOR ACCESS)
  app.get("/profile", authenticateWithJWT, async function(req, res){
    res.json({
      "message": "Protected route is accessed successfully",
      "payload": req.payload
    })
  })
}

main();

// 3. STARTING THE SERVER
PORT_NUMBER = 3001;

app.listen(PORT_NUMBER, function(){
  console.log("Server has started. Go to http://localhost:" + PORT_NUMBER)
})