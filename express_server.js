// require and instantiate express
var express = require("express");

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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

// set the view engine to ejs
app.set("view engine", "ejs")

// add new URl page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// all URLs page
app.get("/urls", (req, res) => {
  // define  object as templateVars variable
  let templateVars = { urls: urlDatabase };
  // pass the object to the render method so we can make certain data available for the template
  res.render("urls_index", templateVars);
});

// single URL page given an id
app.get("/urls/:id", (req, res) => {
  // run through objects in database to see if given id is equal to an objects id, if it is define a new variable equal to fullURL
  let fullURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.id) {
      fullURL = url.url;
    }
  })
  let templateVars = { shortURL: req.params.id, fullURL: fullURL };
  // pass the object to the render method so we can make certain data available for the template
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.shortURL) {
      longURL = url.url;
    }
  })
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
