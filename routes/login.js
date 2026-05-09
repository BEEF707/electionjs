var express = require('express');
var router = express.Router();
var { generateKey} = require('../utils/crypto');
var { getWithBearerToken, postWithBearerToken} = require('../utils/APIrequests');
var {createToken, verifyToken}=require('../utils/usertoken');

/* GET register page. */
router.get('/', verifyToken, function (req, res, next) {
  if (res.locals.name){
    res.redirect('/');
  }
  else{
  res.render('login', { title: 'Login' , result: "To be determined"});
  }
});

router.post('/', async function (req, res, next) {
  //Getting info from form
  let password=req.body.password;
  let username=req.body.username;

  let usernameurl='https://drive.api.hscc.bdpa.org/v1/users/' + username
  if (process.env.PRODUCTION=="false") {
      console.log(usernameurl);       
  }
  let token=process.env.BEARER_TOKEN

  const getResponse= await getWithBearerToken(usernameurl,token)
  if (process.env.PRODUCTION=="false") {
      console.log(getResponse);       
  } 

  if (!getResponse.success){
    res.render('login', { title: 'Login' , result: "User not defined"});
    return
  }
  //If user exists get salt
  var salt=getResponse.user.salt;
  if (process.env.PRODUCTION=="false") {
      console.log(salt);       
  }

  var key=generateKey(password,salt)
  //Test key
  const keyData={
    key
  }
  const keyURL="https://drive.api.hscc.bdpa.org/v1/users/" + username + "/auth"
  const keyResponse=await postWithBearerToken(keyURL,token,keyData)

  if (process.env.PRODUCTION=="false") {
    console.log(keyResponse);       
  }

  if (keyResponse.success){
    token=createToken(username);  //Creating our auth token
    res.redirect('/');
  }
  else{
    res.render('login', { title: 'Login' , result: "Incorrect password"});
  }

});
