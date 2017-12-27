var express = require("express");
var mongojs = require("mongojs");
// var express = require("express-handlebars");
// var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request= require("request");


// Initialize Express
var app = express();

var MONGODB_URI = process.env.MONGODB_URI

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


db.dropDatabase();
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.send("Hello World");
});

var PORT = 3000;

app.get("/all", function(req, res) {
    db.scrapedData.find({}, function (err, found) {
      if (err) {
        console.log(err)
      } 
      else {
        res.json(found);
      }
    });

})

app.get("/scrape", function(req, res) {

  request("https://www.nytimes.com/section/us", function(error, response, html){
      var $ = cheerio.load(html);

      $(".headline").each(function(i, element){
          var title = $(this).children("a").text();
          var link = $(this).children("a").attr("href");
          var summary = $(this).text();
       
          if (title && link && summary) {
              db.scrapedData.save({
                title: title,
                link: link,
                summary: summary
              },
              function(error, saved) {
                if (error) {
                  console.log(error);
                }

                else {
                  console.log(saved);
                }
              });
          }
      });

    });


  //     $(".summary").each(function(i, element){
  //         var summary = $(this).text();
         
  //         if (summary) {
  //             db.scrapedData.save({
  //               summary: summary
  //             },
  //             function(error, saved) {
  //               if (error) {
  //                 console.log(error);
  //               }

  //               else {
  //                 console.log(saved);
  //               }
  //             });
  //         };
     
  // });

// });
  res.send("scrape complete");
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
