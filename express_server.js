// require and instantiate express
var express = require("express");
var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var PORT = process.env.PORT || 8080; // default port 8080

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// fake shortened URLs to simulate a database
var urlDatabase = [
  {
    "id": "b2xVn2",
    "url": "http://www.lighthouselabs.ca",
  },
  {
    "id": "9sm5xK",
    "url": "http://www.google.com"
  }
];

var userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// --------------------------------------------------------------

// set the view engine to ejs
app.set("view engine", "ejs")

// --------------------------------------------------------------

// login route
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// logout route
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// --------------------------------------------------------------

// render registratin page
app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies.username };
  res.render("urls_register", templateVars);
});

// post new user to user database
app.post("/register", (req, res) => {
  let newUserId = generateRandomString();
  for (user in userDatabase) {
    if (userDatabase[user].email == req.body.email) {
      console.log("400 Bad Request");
      res.status(400).send("Email already exists");
      return;
    }
  }
  userDatabase[newUserId] = {id: newUserId, email: req.body.email, password: req.body.password};
  console.log(userDatabase);
  res.cookie("user_id", newUserId);
  res.redirect("/urls");
});

// --------------------------------------------------------------

// render add new URl page
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies.username };
  res.render("urls_new", templateVars);
});

// post new URL to url database
app.post("/urls", (req, res) => {
  urlDatabase.push({ id: generateRandomString(), url: req.body.longURL });
  console.log(urlDatabase);
  res.redirect("/urls");
});

// --------------------------------------------------------------

// render all URLs page
app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies.username, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// --------------------------------------------------------------

// render specific URL page
app.get("/urls/:id", (req, res) => {
  let fullURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.id) {
      fullURL = url.url;
    }
  })
  let templateVars = { username: req.cookies.username, shortURL: req.params.id, fullURL: fullURL };
  res.render("urls_show", templateVars);
});

// --------------------------------------------------------------

// post/replace an edited url
app.post("/urls/:id", (req, res) => {
  urlDatabase.forEach(function(url, i) {
    if (url.id === req.params.id) {
      url.url = req.body.newLongURL;
    }
  })
  console.log(urlDatabase);
  res.redirect("/urls");
});

// --------------------------------------------------------------

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

// --------------------------------------------------------------

// delete url from database
app.post("/urls/:id/delete", (req, res) => {
  var urlIndex = null;
  urlDatabase.forEach(function(url, i) {
    if (url.id === req.params.id) {
      urlIndex = i;
    }
  })
  if (urlIndex) {
    urlDatabase.splice(urlIndex, 1);
    console.log(urlDatabase);
  }
  res.redirect("/urls");
});

// --------------------------------------------------------------

// generateRandomString function
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
