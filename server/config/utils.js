// DB HELPER FUNCTIONS
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var app = require('../server.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var urlImage = require('url-to-image');
var cloudinary = require('cloudinary');
var natural = require('natural');
var website = (process.env.SITE || "http://localhost:3000");
if (website === "http://localhost:3000") {
    var apiKeys = require('../../APIs.js');
}

//fetches a user node based on an email
var db= require('seraph')({
  server: process.env.dbServerUrl || apiKeys.dbServerUrl,
  user: process.env.dbUser || apiKeys.dbUser,
  pass: process.env.dbPassword || apiKeys.dbPassword
});

// initialize cloudinary connection for storing and retreiving images
cloudinary.config({
  cloud_name: process.env.cloud_name || apiKeys.cloudName,
  api_key: process.env.cloudinary_api_key || apiKeys.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_password || apiKeys.cloudinary_api_password
});

module.exports = {

  fetchUserByEmail: function(email, cb) {
    var cypher = "MATCH (node:User)" +
      " WHERE node.email = " +
      "'" + email + "'" +
      " RETURN node";
    db.query(cypher, function(err, result) {
      if (err) throw err;
      console.log('fetch fetchUserByEmail', result[0]);
      cb(result[0]);
    });
  },

createRelation: function(clip, tag, how, relevance, cb) {
  db.relate(clip, how, tag, {
      relevance: relevance || null
    }, function(err, relationship) {
      // console.log('RELATIONSHIP:', relationship);
      //provide a callback on the clip (the 'from') node
      cb(clip);
    });
  },

  //TODO: move apiKeys to apiKeysAndPasswords.js
  createWatsonUrl: function(url, cb) {
    console.log('inside watson');
    var API = process.env.watsonAPI || apiKeys.watsonAPI;
    var baseUrl = 'http://gateway-a.watsonplatform.net/calls/';
    var endUrl = 'url/URLGetRankedKeywords?apikey=' + API + '&outputMode=json&url=';
    var fullUrl = baseUrl + endUrl + url;
    // console.log(fullUrl);
    request(fullUrl, function (err, response, body) {
      var bodyParsed = JSON.parse(body);
      // console.log('WATSON KEYWORDS:', bodyParsed.keywords);
      cb(bodyParsed.keywords);
    });
  },

  storeTags: function(tag, cb) {
    var relevance = tag.tfidf;
  db.save({
      tagName: tag.term
    }, function(err, node) {
      if (err) throw err;
    db.label(node, ['Tag'],
        function(err) {
          if (err) throw err;
          // console.log(node.tagName + " was inserted as a Topic into DB");
          // console.log('TAGNODE:', node);
        });
      cb(node, relevance);
    });
  },

  createSuggestionNode: function(suggestion, cb) {
    //Get image for suggestionNode before saving to DB
      //Call URLtoImage to fetch sugestion,
      //Once it completes, save it to DB
      // console.log('SUGGESTION.URL inside CREATESUGGESTIONNODE', suggestion.url);

    //Each suggestion is an object with a title and a url as its property
    var saveSuggestionToDb = function(suggestionImgUrl){
      console.log('SUGGESTIONIMAGE URL FROM CLOUDINARY>>>>>>>>>>>>>', suggestionImgUrl);
      console.log('SAVING SUGGESTIONNODE TO DATABASE');
      db.save({
      suggestionTitle : suggestion.title,
      suggestionUrl : suggestion.url,
      suggestionImg : suggestionImgUrl
      }, function (err, node){
      if (err) throw err;
      db.label(node, ['Suggestion'],
        function(err) {
          if (err) throw err;
          console.log('New Suggestion Node Added to Clip!', node);
        });
      cb(node);
    });
   };

   this.urlToImage(suggestion.url, saveSuggestionToDb);
  },
  // captures screen image on chrome_ext click
  urlToImage: function(targetUrl, cb) {
    // Options object to pass to urlImage
    var options = {
      width: '640',
      height: '600',
      // Give a short time to load more resources
      requestTimeout: '300'
    };

    // Function to parse url
    var urlapi = require('url');
    var url = urlapi.parse(targetUrl);

    var hostName = url.hostname;
    var fileName = 'tempImg/' + hostName + '.jpg';

    // API call to url-to-image module
    return urlImage(targetUrl, fileName, options).then(function() {
      // Send image to Cloudinary
      cloudinary.uploader.upload(fileName, function(result) {
        // console.log("Cloudinary result url: ", result);
        cb(result.url);
      },
      {
        crop: 'crop',
        width: 640,
        height: 600,
        x: 0,
        y: 0,
        format: "jpg"
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  //Call to FAROO API to get site suggestions
  suggestionsAPI : function(keyword, cb, flag) {
    var farooAPI = process.env.FAROO || apiKeys.FAROO;

    //No flag is passed in, use keyword to
    var fullUrl = 'http://www.faroo.com/api?q=' + keyword + '&start=1&length=3&l=en&src=web&i=false&f=json' + farooAPI;

    // //When a flag is passed in as third argument, grab Trending News from Faroo as default suggestions
    // if (flag) {

    // }

    request(fullUrl, function (err, res, body) {
      if(err) {
        console.log('ERROR inside suggestionsAPI!!');
      }

      var bodyParsed = JSON.parse(body);
      console.log('BODY>>>>>>>>>>>>>>>>',bodyParsed);
      //check if result has suggestions, if NOT, call suggestionsAPI with flag
      if (bodyParsed.results.length === 0) {
        module.exports.getTrendingNews(function(news) {
          cb(news);
        });
      } else {
        cb(bodyParsed);
      }
    });
  },

  getTrendingNews : function(cb) {
    var farooAPI = process.env.FAROO || apiKeys.FAROO;

    var fullUrl = 'http://www.faroo.com/api?q=&start=1&length=3&l=en&src=news&f=json' + farooAPI;

    request(fullUrl, function (err, res, body) {
      if(err) {
        console.log('ERROR inside getTrendingNews : ', err);
      }
      var bodyParsed = JSON.parse(body);
      console.log('BODY>>>>>>>>>>>>>>>>',bodyParsed);
      cb(bodyParsed);
    });
  }
};
