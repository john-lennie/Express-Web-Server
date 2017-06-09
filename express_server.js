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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// single URL page given an id
app.get("/urls/:id", (req, res) => {
  let fullURL = null;
  urlDatabase.forEach(function(url) {
    if (url.id == req.params.id) {
      fullURL = url.url;
    }
  })
  let templateVars = { shortURL: req.params.id, fullURL: fullURL };
  res.render("urls_show", templateVars);
});

// edit URL
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

// add new url to database
app.post("/urls", (req, res) => {
  urlDatabase.push({ id: generateRandomString(), url: req.body.longURL });
  console.log(urlDatabase);
  res.send("URL Submitted");         // Respond with 'Ok' (we will replace this)
});

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// generateRandomString function
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
