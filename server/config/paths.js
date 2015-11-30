
var utils= require('./utils.js')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');

var db = require('seraph')({
    server: "http://clipr.sb02.stations.graphenedb.com:24789",
    user: "clipr",
    pass: 'oSvInWIWVVCQIbxLbfTu'
});

// Set website (Heroku or Localhost) and callbackURL
var website = (process.env.SITE || "http://localhost:3000");
var callbackURL = website + '/auth/google/callback';

if(website === "http://localhost:3000") {
    var keysAndPassword = require('../apiKeysAndPasswords.js');
}

// Used in Google OAuth
var clientID = process.env.clientID || keysAndPassword.clientID;
var clientSecret = process.env.clientSecret || keysAndPassword.clientSecret;


var passport= require('passport')
/**
  Google OAuth2
**/

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,

}, function(accessToken, refreshToken, profile, done) {
    console.log('looking for gid', profile)
    var cypher = "MATCH (node: User)" +
        " WHERE node.username = " +
        "'" + profile.displayName + "'" +
        " RETURN node";
    db.query(cypher, function(err, result) {

        if (err) {
            throw err;
        }

        if (result.length === 0) {
            //create node
            db.save({
                username: profile.displayName,
                sessionToken: accessToken,
                email: profile.emails[0].value
            }, function(err, node) {
                if (err) {
                    throw err;
                }

                db.label(node, ['User'], function(err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, node);
                });

            });
        } else {

        }
        //attach user node and acces token to user
        profile.userOne = result[0];
        profile.accessToken = accessToken;

        return done(null, profile);

    });

}));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

module.exports = {

    googleAuth: function() {

      passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/plus.login', 'email']
        },
        function(req, res) {
          //send user to google to authenticate

        });
  },

  googleCallback: function() {

    passport.authenticate('google', {
        failureRedirect: '/#/landing'
      },
      function(req, res) {
        //when they come back after a successful login, setup clipr cookie
        res.cookie('clipr', req.session.passport.user.accessToken)
          // Successful authentication, redirect home.
        res.redirect('/#/clips');
      });
},

storeClip: function(req, res) {

    var email = req.body.email

    db.save({
      clipUrl: req.body.url,
      title: req.body.title
        // imgUrl : req.query.imgUrl
    }, function(err, clipNode) {
      if (err) throw err;
      db.label(clipNode, ['Clip'], function(err) {
        if (err) throw err;
        console.log(clipNode + " was inserted as a Clip into DB");
        //at this point we have the clip node created, so find the user and relate clip->user

        utils.fetchUserByEmail(email, function(userNode) {
            utils.createRelation(clipNode, userNode, 'owns', 'owns', function(fromNode) {})
          })
          //query watson, and loop over top 3 results creating a keyword node for each
        utils.createWatsonUrl(clipNode.clipUrl, function(keywords) {
          for (var i = 0; i < 3; i++) {
            utils.storeTags(keywords[i], function(tagNode, relevance) {
              //create relationship between each keyword node and the clip node
              utils.createRelation(clipNode, tagNode, relevance, 'contains', function(fromNode) {
                console.log('relationship between clip & tag node created')

              });
            });
          }
        });
      });
    });

  },

  loadClipsByCategory: function(req, res) {
    console.log('in clips by category', req.query.category)
    var cypher = "MATCH(clips)-[:BELONGSTO]->(category) WHERE category.category='" + req.query.category + "' RETURN clips";
    db.query(cypher, function(err, results) {
      if (err) throw err;
      console.log('category results', results)
      res.send(results);
    });
  },

  loadAllClips: function(req, res) {
    db.nodesWithLabel('Clip', function(err, results) {
      console.log('server results', results);
      res.send(results);
    });
  },

  addNote: function(req, res) {
    console.log('in addNote');
    console.log('url', req.query.url);
    // console.log('url', req.query.user)

    var clipNode;
    var noteNode;
    db.find({
      clipUrl: req.query.url
    }, function(err, clip) {
      if (err) throw err;
      clipNode = clip;
    });
    console.log(req.query.note);
    db.save({
      note: req.query.note
    }, function(err, note) {
      console.log(' note was saved', note);
      noteNode = note;
      if (err) throw err;
      db.label(noteNode, ['Note'], function(err) {
        if (err) throw err;
        console.log('noteNode', noteNode);
        console.log('clipNode', clipNode);
      });
      utils.createRelation(noteNode, clipNode[0], 'belongsTo', 3);
      res.send(noteNode)
    });
  },

  loadNotes: function(req, res) {
    console.log('inloadnotes');
    var cypher = "MATCH(notes)-[:belongsTo]->(clip) WHERE clip.clipUrl='" + req.query.url + "' RETURN notes";
    db.query(cypher, function(err, result) {
      if (err) throw err;
      console.log('NOTESRESULT', result);
      res.send(result);
    });
  }

}





// Get all existing bookmarks from users google bookmarks
// THIS ROUTE IS USED TO TEST THAT SERVER IS GETTING ALL BOOKMARKS
// app.post('/user/post/getAllBookmarks', function(req, res) {

// });

// Get a new bookmark from client