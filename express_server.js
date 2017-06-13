// ---------------------------- Require and instantiate express ----------------------------------

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const PORT = process.env.PORT || 8080; // default port 8080

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ---------------------------- "Databases" ----------------------------------

var urlDatabase = [];

var userDatabase = {};

// ------------------------------ generateRandomString Function --------------------------------

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// ----------------------------- Set EJS View Engine ---------------------------------

app.set("view engine", "ejs")

// --------------------------- COOKIES -----------------------------------

// ADD NEW USER TO DATABASE (ID: ID, EMAIL & PASSWORD) & CREATE COOKIE (USER_ID)
app.post("/register", (req, res) => {
  let newUserId = generateRandomString();
  for (user in userDatabase) {
    if (userDatabase[user].email == req.body.email) {
      console.log("400 Bad Request");
      res.status(400).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/login"></head></html>');
      return;
    }
  };
  if (req.body.email == "" || req.body.password == "") {
    console.log("400 Bad Request");
    res.status(400).send("Both fields required");
    return;
  }
  userDatabase[newUserId] = {id: newUserId, email: req.body.email, password: req.body.password};
  console.log(userDatabase);
  res.cookie("user_id", userDatabase[newUserId].id);
  res.redirect("/urls");
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// ACTIVATE EXISTING USER COOKIE
app.post("/login", (req, res) => {
  var activeUser = null;
  for (user in userDatabase) {
    if (userDatabase[user].email === req.body.email && userDatabase[user].password === req.body.password) {
      activeUser = userDatabase[user].id;
    }
  };
  console.log(userDatabase);
  res.cookie("user_id", activeUser);
  res.redirect("/urls");
});



// ----------------------------- GET & RENDER Templates ---------------------------------

// /urls page
app.get("/urls", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// /urls/new page
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { user_id: req.cookies.user_id };
    res.render("urls_new", templateVars);
  }
});

// /login page
app.get("/login", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id };
  res.render("urls_login", templateVars);
});

// /register page
app.get("/register", (req, res) => {
  let templateVars = { user_id: req.cookies.user_id };
  res.render("urls_register", templateVars);
});

// /urls/:id page
app.get("/urls/:id", (req, res) => {
  let fullURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.id) {
      fullURL = url.url;
    }
  })
  let templateVars = { user_id: req.cookies.user_id, shortURL: req.params.id, fullURL: fullURL };
  res.render("urls_show", templateVars);
});

// ---------------------------- POST/GET --> REDIRECT Actions ----------------------------------

// add URL to urlDatabase
app.post("/urls", (req, res) => {
  urlDatabase.push({ id: generateRandomString(), url: req.body.longURL, userID: req.cookies.user_id });
  console.log(urlDatabase);
  res.redirect("/urls");
});

// delete url
app.post("/urls/:id/delete", (req, res) => {
  var urlIndex = null;
  urlDatabase.forEach(function(url, i) {
    if (url.id === req.params.id) {
      urlIndex = i;
    }
  })
  if (urlIndex >= 0) {
    urlDatabase.splice(urlIndex, 1);
    console.log(urlDatabase);
  }
  res.redirect("/urls");
});

// edit url
app.post("/urls/:id", (req, res) => {
  urlDatabase.forEach(function(url, i) {
    if (url.id === req.params.id) {
      url.url = req.body.newLongURL;
    }
  })
  console.log(urlDatabase);
  res.redirect("/urls");
});

// redirect shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  let longURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.shortURL) {
      longURL = url.url;
    }
  })
  res.redirect(longURL);
});
