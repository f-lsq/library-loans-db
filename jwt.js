const jwt = require("jsonwebtoken");

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

module.exports = { generateAccessToken, authenticateWithJWT };