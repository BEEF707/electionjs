const jwt = require("jsonwebtoken");

//Creating a token for authorization
// @param username (the name of the logged in user)
// @returns a token that we can use for verification
const createToken = (username) => {
    var token=jwt.sign(
        {name:username} , process.env.BEARER_TOKEN, {expiresIn: 86400000}
    )
    if (process.env.PRODUCTION=="false"){
        console.log(token)
    }
    global.userToken=token
    return token
}

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || global.userToken;
  
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.BEARER_TOKEN);
    req.user = decoded;
    res.locals.name=req.user.name;
    return next();
  } 
  catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const destroyToken = (req, res, next) =>{
    global.userToken=null;
}

module.exports ={
    createToken, verifyToken, destroyToken
}