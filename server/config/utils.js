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
//fetches a user node based on an email
  var db= require('seraph')({
  server: "http://clipr.sb02.stations.graphenedb.com:24789",
  user: "clipr",
  pass: 'oSvInWIWVVCQIbxLbfTu'
})

module.exports = {

fetchUserByEmail: function(email, cb) {
    var cypher = "MATCH (node:User)" +
      " WHERE node.email = " +
      "'" + email + "'" +
      " RETURN node";
  db.query(cypher, function(err, result) {
      if (err) throw err;
      console.log('fetch fetchUserByEmail', result[0])
      cb(result[0])
    })

  },

createRelation: function(clip, tag, how, relevance, cb) {
  db.relate(clip, how, tag, {
      relevance: relevance || null
    }, function(err, relationship) {
      console.log('RELATIONSHIP:', relationship);
      //provide a callback on the clip (the 'from') node
      cb(clip);

    });
  },

createWatsonUrl: function(url, cb) {
    console.log('inside watson');
    var API = '5770c0482acff843085443bfe94677476ed180e5';
    var baseUrl = 'http://gateway-a.watsonplatform.net/calls/';
    var endUrl = 'url/URLGetRankedKeywords?apikey=' + API + '&outputMode=json&url=';
    var fullUrl = baseUrl + endUrl + url;
    console.log(fullUrl);
    request(fullUrl, function(err, response, body) {
      var bodyParsed = JSON.parse(body);
      console.log('WATSON KEYWORDS:', bodyParsed.keywords);
      cb(bodyParsed.keywords);
    });
  },

storeTags: function(tag, cb) {
    console.log('in storeTags');
    var relevance = tag.relevance;
  db.save({
      tagName: tag.text
    }, function(err, node) {
      if (err) throw err;
    db.label(node, ['Tag'],
        function(err) {
          if (err) throw err;
          console.log(node.tagName + " was inserted as a Topic into DB");
          console.log('TAGNODE:', node);
        });
      cb(node, relevance);
    });
  }
}