// LOAD DEPENDENCIES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var compression = require('compression'); 
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var router = require('./router.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var clientID   = '956444297317-c7q8o48o6trac3u2c81l5q6vf31r30up.apps.googleusercontent.com';
var clientSecret = 'reN8EHttjTzrGmvC6_C4oivR';
var callbackURL  = 'http://localhost:3000/auth/google/callback';

// INITIALIZE SERVER
var port = process.env.PORT || 3000;
var app = express();

// INITIALIZE DB CONNECTION
var db = require('seraph')({
  server: "http://clipr.sb02.stations.graphenedb.com:24789",
  user: "clipr",
  pass: 'oSvInWIWVVCQIbxLbfTu'
});


app.use(session({ 
  secret: 'this is a secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly : false  
  }
}));
app.use(passport.initialize());
app.use(passport.session());

/**
  Google OAuth2
**/
passport.use(new GoogleStrategy({
  clientID : clientID,
  clientSecret : clientSecret,
  callbackURL  : callbackURL,

}, function (accessToken, refreshToken , profile, done) {

    var cypher = "MATCH (node: User)" +
                 " WHERE node.username = " +
                 "'" + profile.displayName + "'" +
                 " RETURN node";
    db.query(cypher, function (err, result) {

      if (err) { throw err; }

      if(result.length === 0) {
        //create node
        db.save({
          username: profile.displayName,
          sessionToken: accessToken
        }, function (err, node) {
          if(err) { throw err; }

          db.label(node, ['User'], function (err) {
            if(err) { throw err; }
            
            return done(null, node);
          });

        });
      } else {
          
      }
<<<<<<< HEAD
<<<<<<< HEAD
      //attach user node and acces token to user
=======
>>>>>>> browser setting cookies, not destroying
=======
      //attach user node and acces token to user
>>>>>>> [chore]: google signin implemented
     profile.userOne = result[0];
     profile.accessToken = accessToken;

      return done(null, profile);

    });

}));

<<<<<<< HEAD
<<<<<<< HEAD
=======
//used to serialize the user from the session
// passport.serializeUser(function (node, done) {
//   console.log("This is in serializeUser ", node);
//   done(null, node.username);
// });

// //used to deserialize the user
// passport.deserializeUser(function (name, done) {
//   console.log("This is in deserializeUserUser ", name);
//   var cypher = "MATCH (node: User)" +
//                  " WHERE node.username = " +
//                  "'" + name + "'" +
//                  " RETURN node";
// console.log("This is the------  ", cypher);
//   db.query(cypher, function (err, result) {
//     console.log("This is the result  ", result);
//     if(err) { throw err; }
//     return done(err, result[0]);
//   });
// });
>>>>>>> browser setting cookies, not destroying
=======
>>>>>>> [chore]: google signin implemented

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '../../app'));

// Set Response Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(compression());

// ROUTES

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }),
    function(req, res){
   //send user to google to authenticate
     
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/#/landing' }),
  function(req, res) {
<<<<<<< HEAD
<<<<<<< HEAD
    //swhen they come back after a successful login, etup clipr cookie
    res.cookie('clipr',req.session.passport.user.accessToken)
=======
    //console.log('cookie', res.cookie.connect.sid)
    console.log('hello token',req.session.passport)
    console.log('hello token',req.session.passport.user.accessToken)
    res.cookie('clipr',req.session.passport.user.accessToken)
  
>>>>>>> browser setting cookies, not destroying
=======
    //swhen they come back after a successful login, etup clipr cookie
    res.cookie('clipr',req.session.passport.user.accessToken)
>>>>>>> [chore]: google signin implemented
    // Successful authentication, redirect home.
    res.redirect('/#/clips');
  });

// Get all existing bookmarks from users google bookmarks
// THIS ROUTE IS USED TO TEST THAT SERVER IS GETTING ALL BOOKMARKS
app.post('/user/post/getAllBookmarks', function(req, res) {
  console.log("--------------");
  console.dir(req.body);
  console.log(req);
  console.log("--------------");
  console.log("");
});

// Get a new bookmark from client
app.post('/user/post/storeclip', function(req, res) {
  console.log('TITLE: ', req.query.title);
  db.save({
    clipUrl: req.query.url,
    title: req.query.title
  }, function(err, node) {
    if (err) throw err;
    console.log('clipnode', node);
    db.label(node, ['Clip'], function(err) {
      if (err) throw err;
      console.log(node + " was inserted as a Clip into DB");
      createWatsonUrl(node.clipUrl, function(keywords) {
        for (var i = 0; i < 3; i++) {
          storeTags(keywords[i], function(tagNode, relevance) {
            createRelation(node, tagNode, relevance, 'contains');
          });
        }
      });
    });
  });
});

app.get('/loadClips', function(req, res) {
  db.nodesWithLabel('Clip', function(err, results) {
    console.log('server results', results);
    res.send(results);
  });
});

app.post('/user/post/addNote', function(req, res) {
  console.log('in addNote');
  console.log('url', req.query.url);
    // console.log('url', req.query.user)

  var clipNode;
  db.find({
    clipUrl: req.query.url
  }, function(err, clip) {
    if (err) throw err;
    clipNode = clip;
  });
  console.log(req.query.note);
  db.save({
    note: req.query.note
  }, function(err, noteNode) {
    console.log(' note was saved', noteNode);
    if (err) throw err;
    db.label(noteNode, ['Note'], function(err, labeledNode) {
      if (err) throw err;
      console.log('noteNode', labeledNode);
      console.log('clipNode', clipNode);
    });
    createRelation(noteNode, clipNode, 3, 'belongsTo');
    // createRelation(userNode, noteNode, 3, 'owns');
  });
});

app.post('/user/post/loadNotes', function(req, res) {
  console.log('inloadnotes');

  var cypher = "MATCH(notes)-[:belongsTo]->(clip) WHERE clip.clipUrl='" + req.query.url + "' RETURN notes";

  db.query(cypher, function(err, result) {
    if (err) throw err;
    console.log('NOTESRESULT', result);
  });
});

// DB HELPER FUNCTIONS
var createRelation = function(clip, tag, relevance) {
  console.log('clip:', clip);
  console.log('tag:', tag);
  db.relate(clip, how, tag, {
    relevance: relevance
  }, function(err, relationship) {
    console.log('RELATIONSHIP:', relationship);
  });
};

var createWatsonUrl = function(url, cb) {
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
};

var storeTags = function(tag, cb) {
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
};

app.listen(port);
console.log('Bits please server is now running at ' + port);