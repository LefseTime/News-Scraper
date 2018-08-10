var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");

var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsTestDB5";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

app.get("/scrape", function (req, res) {

  axios.get("http://theonion.com").then(function (response) {

    var $ = cheerio.load(response.data);

    $("article.postlist__item").each(function (i, element) {

      var result = {};

      result.title = $(element).children("header").children("h1").children("a").text();
      result.link = $(element).children("header").children("h1").children("a").attr("href");
      result.summary = $(element).children(".item__content").children(".excerpt").children("p").text();
      result.time = $(element).children("header").children(".meta--pe").children().children().attr("datetime");

      
      //console.log("scrape " + result.summary)
      
      db.Article.create(result)
        .then(function (dbArticle) {
          //console.log("db " + dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });
    });
    res.send("Now you're scrapin'!");
  });
});



app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (result) {
      res.json(result)
    })
});


app.get("/articles/:id", function (req, res) {
  //let id = req.params.id;

  db.Article.find({ _id: req.params.id })
    .populate("note")
    .then(function (result) {
      console.log(result[0])
      res.json(result[0])
    })
});


app.post("/articles/:id", function (req, res) {
  let id = mongojs.ObjectId(req.params.id)
  //console.log("in the app post route", id)
  //console.log("req.body",req.body)
  db.Note.create(req.body)
    .then(function (dbNote) {
      console.log(dbNote)
      return db.Article.findOneAndUpdate({ _id: id }, { $push: { note: dbNote._id } }, { new: true })
    })
    .then(function (dbArticle) {
      return res.json(dbArticle)
    })
});

// app.get("/note/:id", function (req, res) {
//   //let id = req.params.id;

//   db.Note.find({ _id: req.params.id })
//     .populate("note")
//     .then(function (result) {
//       console.log(result[0])
//       res.json(result[0])
//     })
// });

// app.post("/note/:id", function (req, res) {
//   db.Note.findOneAndUpdate({ _id: req.params.id }, { $push: req.body }, { new: true })
//       .then(function (dbArticle) {
//           res.json(dbArticle)
//       })
//       .catch(function (err) {
//           res.json(err)
//       })
// })




// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


// how it works:
// 1. scrape (button that scrapes on click like the exapmle?); send to /scrape
// 2. database
// 3. pull from database (on page load and when scrape button clicked, after scraping finished), and load into html
// 4. comment button (type in a comment and gets logged into database)