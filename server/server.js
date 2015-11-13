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
var http= require('http');


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
    db.label(node, ['Clip'],
      function(err) {
        if (err) throw err;
        console.log(node.clipUrl + "was inserted into DB");
        createWatsonUrl(node.clipUrl)
      })
  })
})

var createWatsonUrl = function(url) {
  console.log('inside watson')
  var API = '5770c0482acff843085443bfe94677476ed180e5'
  var baseUrl = 'http://gateway-a.watsonplatform.net/calls/'
  var endUrl = 'url/URLGetRankedKeywords?apikey=' + API + '&outputMode=json&url='
  var fullUrl = baseUrl + endUrl + url
  console.log(fullUrl)
  request(fullUrl,  function(err, response, body){
  	console.log('RESPONSE:',JSON.parse(body));
  	response.end()
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