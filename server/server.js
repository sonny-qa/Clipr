/**

 *Server Configuration File

**/

//External Resources
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
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
          storeTags(keywords[i], function(tagNode) {
              createRelation(node, tagNode);
            })
          }
      })
    })
  })
})


var createRelation = function(clip, tag) {
  console.log('clip:', clip)
  console.log('tag:', tag)
  db.relate(clip, 'contains', tag, {
    relevance: tag.relevance
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
  db.save({
    tagName: tag.text
      // relevance: tag.relevance
  }, function(err, node) {
    if (err) throw err;
    db.label(node, ['Tag'],
      function(err) {
        if (err) throw err;
        console.log(node.tagName + " was inserted as a Topic into DB")
        console.log('TAGNODE:', node)
      })
    cb(node)
  })

}



// db.save({
//   name: "RACHELLL",
//   age: 25
// }, function(err, node) {
//   if (err) throw err;
//   console.log("Test-Man inserted.");
// });



// var userNode = db.defineNode({
//   label: ['User'],
//   schema: {
//     'userName': db.Joi.string().min(8).max(15).required(),
//     'password': db.Joi.string().min(6).max(10).required(),
//     'email': db.Joi.string().email().required()
//   }
// });

// var cliprNode = db.defineNode({
//   label: ['Clip'],
//   schema: {
//     'siteUrl': db.Joi.string().required(),
//     'mediaUrl': db.Joi.string().optional(),
//     'title': db.Joi.string().max(20).required()
//   }
// });

// var categoryNode = db.defineNode({
//   label: ['Category'],
//   schema: {
//     'category': db.Joi.string().required()
//   }
// });

// var topicNode = db.defineNode({
//   label: ['Topic'],
//   schema: {
//     'topic': db.Joi.string().required()
//   }
// });

// var siteToUser = db.defineRelationship({
//   type: 'bookmark',
//   schema: {
//     'description': db.Joi.string()
//   }
// });

// var categoryToSite = db.defineRelationship({
//   type: 'subject',
//   schema: {
//     'relevancy': db.Joi.number().integer(),
//     'sentiment': db.Joi.string()
//   }
// });

// var topicToCategory = db.defineRelationship({
//   type: 'subject',
//   schema: {
//     'contains': db.Joi.string(),
//     'relevancy': db.Joi.number().integer()
//   }
// });


//you can pass in an operation ("Create", "Replace", "Update")
//check out rainbird to see queries



app.listen(port);
console.log('Bits please server is now running at ' + port);