/**

 *Server Configuration File

**/

//External Resources
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var Promise= require('bluebird');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');


var db = require('seraph')({
  server: "http://clipr.sb02.stations.graphenedb.com:24789",
  user: "clipr",
  pass: 'oSvInWIWVVCQIbxLbfTu'
});





var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '../../app'));
app.use(bodyParser.json());


app.post('/user/post/storeclip', function(req, res) {
  console.log(req.body)
  db.save({
    clipUrl: req.body.clipUrl,
    clipImage: req.body.clipImage,
    title: req.body.title
  }, function(err, node) {
    if (err) throw err;
    db.label(node, ['Clip'], function(err) {
      if (err) throw err;
      console.log(node.clipUrl + "was inserted as a Clip into DB");
      createWatsonUrl(node.clipUrl, function(keywords) {
        for (var i = 0; i < 3; i++) {
          storeTags(keywords[i], function(tagNode, relevance) {
            createRelation(node, tagNode, relevance);
          })
        }
      })
    })
  })
})


var createRelation = function(clip, tag, relevance) {
  console.log('clip:', clip)
  console.log('tag:', tag)
  db.relate(clip, 'contains', tag, {
    relevance: relevance
  }, function(err, relationship) {
    console.log('RELATIONSHIP:', relationship)
  })
}



var createWatsonUrl = function(url, cb) {
  console.log('inside watson')
  var API = '5770c0482acff843085443bfe94677476ed180e5'
  var baseUrl = 'http://gateway-a.watsonplatform.net/calls/'
  var endUrl = 'url/URLGetRankedKeywords?apikey=' + API + '&outputMode=json&url='
  var fullUrl = baseUrl + endUrl + url
  console.log(fullUrl)
  request(fullUrl, function(err, response, body) {
    var bodyParsed = JSON.parse(body);
    console.log('WATSON KEYWORDS:', bodyParsed.keywords)
    cb(bodyParsed.keywords)
  })
}

var storeTags = function(tag, cb) {
  console.log('in storeTags')
  var relevance= tag.relevance;
  db.save({
    tagName: tag.text
  }, function(err, node) {
    if (err) throw err;
    db.label(node, ['Tag'],
      function(err) {
        if (err) throw err;
        console.log(node.tagName + " was inserted as a Topic into DB")
        console.log('TAGNODE:', node)
      })
    cb(node, relevance)
  })
}



app.listen(port);
console.log('Bits please server is now running at ' + port);