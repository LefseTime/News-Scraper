var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");
var body = require("body-parser")

// Make a request call to grab the HTML body from the site of your choice
request("http://theonion.com", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  //if problems, check that html coming back from site (below)
  //console.log(html)
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $(".curation-module__item__wrapper").each(function(i, element) {

    var link = $(element).children().children().children().attr("href");
    var title = $(element).children().children().children().children().children().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
