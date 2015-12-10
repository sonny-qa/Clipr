var utils = require('./utils.js');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var app = require('../server.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var classifier = require('./classify.js');
var natural = require('natural');
var keyword_extractor = require("keyword-extractor");

// Set website (Heroku or Localhost) and callbackURL
var website = (process.env.SITE || "http://localhost:3000");
var callbackURL = website + '/auth/google/callback';

if (website === "http://localhost:3000") {
  var apiKeys = require('../../APIs.js');
}

// Used in Google OAuth
var passport = require('passport');
var clientID = process.env.clientID || apiKeys.clientID;
var clientSecret = process.env.clientSecret || apiKeys.clientSecret;
/**
  Google OAuth2
**/

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// Set Response Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(session({
  secret: 'this is a secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: callbackURL,

}, function(accessToken, refreshToken, profile, done) {
  console.log('looking for gid', profile);
  var cypher = "MATCH (node: User)" +
    " WHERE node.username = " +
    "'" + profile.displayName + "'" +
    " RETURN node";
  db.query(cypher, function(err, result) {

    if (err) {
      throw err;
    }
    console.log("results: ", result);
    if (result.length === 0) {
      //create node
      console.log('CREATING NODE IN CREATE NODE :', result);
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


      //attach user node and acces token to user
      profile.userOne = result[0];
      profile.accessToken = accessToken;
      profile.email = result[0].email;

    }
    return done(null, profile);

  });

}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var db = require('seraph')({
  server: process.env.dbServerUrl || apiKeys.dbServerUrl,
  user: process.env.dbUser || apiKeys.dbUser,
  pass: process.env.dbPassword || apiKeys.dbPassword
});

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/#/landing'
  }),
  function(req, res) {
    console.log('req', req);
    //when they come back after a successful login, setup clipr cookie
    var email = req.session.passport.user.email;
    res.cookie('clipr', email);
    // Successful authentication, redirect home.
    res.redirect('/#/clips');
  });


app.post('/changeCategory', function(req, res) {
  var cypher = "MATCH (n:Clip) WHERE n.title='" + req.query.clipTitle + "' SET n.category='" + req.query.category + "' RETURN n"
  console.log(cypher)
  db.query(cypher, function(err, results) {
    if (err) {
      console.log('ERR', err)
    }
    console.log('Category was successfully changed', results);
    res.send('category successfully changed');
  })
})

app.post('/deleteClip', function(req, res) {
  var cypher = "MATCH (n:User {email:'" + req.query.email + "'})-[q]-(c:Clip{title:'" + req.query.clipTitle + "'})-[w]-(d) delete q,c,w,d";
  console.log('DELETE CYPHER', cypher);
  db.query(cypher, function(err, results) {
    if (err) {
      console.log('DELETE ERROR:', err);
    }
    console.log('Clip successfully delete from DB');
    res.send('clip deleted');
  })
})

app.post('/loadCollections', function(req, res) {
  var cypher = "MATCH (n:Collection) RETURN n"
  db.query(cypher, function(err, result) {
    if (err) {
      console.log('error retrieving collections')
    }
    console.log('collection result', result)
    res.send(result);
  })
})

app.post('/addCollection', function(req, res) {
  console.log('in add collection');
  db.save({
    collection: req.query.collection
  }, function(err, collectionNode) {
    if (err) {
      console.log('error creating collection')
    }
    //label the clip node
    console.log('in label collection')
    db.label(collectionNode, ['Collection'], function(err, result) {
      if (err) {
        console.log('error labeling collection node')
      }
      res.send(result);
    })
  })
});

app.post('/showCollectionClips', function(req, res) {
  var cypher = 'MATCH (n:Clip)-[:partOf]->(c:Collection) WHERE c.collection="' + req.query.collection + '" RETURN n'
  console.log(cypher)
  db.query(cypher, function(err, result) {
    if (err) {
      console.log('error retrieving collection clips')
    }
    console.log('collection clips:', result)
    res.send(result);
  })
})

module.exports = {

  incrementCount: function(req, res) {
    console.log('in increment count')
    var cypher = 'MATCH (n:Clip {title:"' + req.query.clipTitle + '"}) SET n.clickCount= n.clickCount + 1 RETURN n'
    db.query(cypher, function(err, result) {
      if (err) {
        console.log('error increasing clickCount')
      }
      console.log('countresult', result)
      res.send(result)
    })
  },

  addToCollection: function(req, res) {
    var cypher = 'MATCH (n:Clip {title:"' + req.query.clip + '"}),(c:Collection {collection:"' + req.query.collection + '"}) CREATE n-[r:partOf]->c  RETURN r'
    console.log(cypher)
    db.query(cypher, function(err, result) {
      if (err) {
        console.log('error in relating collection')
      }
      console.log('Added To Collection', result)
    })
  },

  loadClipsByCategory: function(req, res) {
    console.log('in clips by category', req.query.category);
    var cypher = "MATCH(clips)-[:BELONGSTO]->(category) WHERE category.category='" + req.query.category + "' RETURN clips";
    db.query(cypher, function(err, results) {
      if (err) throw err;
      console.log('category results', results);
      res.send(results);
    });
  },

  googleAuth: passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login', 'email']
    },
    function(req, res) {
      //send user to google to authenticate

    }),
  loadAllClips: function(req, res) {
    console.log('COOKIES', req.query.cookie);
    var cypher = "MATCH(suggestions:Suggestion)<-[:related]-(clips:Clip)-[:owns]->(user:User)WHERE user.email='" + req.query.cookie + "'RETURN clips,suggestions";

    //TODO : Query DB to find suggestionNodes for each clipNode
    //Attach suggestionNodes as a property of clipNode before sending it back to front-end
    db.query(cypher, function(err, results) {
      // console.log('CLIPS AND SUGGESTIONNODES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', results);
      res.send(results);
    });
  },

  // addNote: function(req, res) {
  //   console.log('in addNote');
  //   console.log('url', req.query.url);
  //   // console.log('url', req.query.user)

  //   var clipNode;
  //   var noteNode;
  //   db.find({
  //     clipUrl: req.query.url
  //   }, function(err, clip) {
  //     if (err) throw err;
  //     clipNode = clip;
  //   });
  //   console.log(req.query.note);
  //   db.save({
  //     note: req.query.note
  //   }, function(err, note) {
  //     console.log(' note was saved', note);
  //     noteNode = note;
  //     if (err) throw err;
  //     db.label(noteNode, ['Note'], function(err) {
  //       if (err) throw err;
  //       console.log('noteNode', noteNode);
  //       console.log('clipNode', clipNode);
  //     });
  //     utils.createRelation(noteNode, clipNode[0], 'belongsTo', 3);
  //     res.send(noteNode);
  //   });
  // },

  // loadNotes: function(req, res) {
  //   console.log('inloadnotes');
  //   var cypher = "MATCH(notes)-[:belongsTo]->(clip) WHERE clip.clipUrl='" + req.query.url + "' RETURN notes";
  //   db.query(cypher, function(err, result) {
  //     if (err) throw err;
  //     // console.log('NOTESRESULT', result);
  //     res.send(result);
  //   });
  // },

  //KEEP FOR NOW ---------------------
  //When a user request suggestions, we query the DB and send back suggestions
  // getSuggestions: function (req, res) {
  //   console.log('TRAPSOUL', req.query.title);
  //   var title = req.query.title;
  //   var cypher = 'MATCH (n:Clip {title:"' + title  + '"})-->(s:Suggestion) RETURN s';

  //   db.query(cypher, function (err, result) {
  //     console.log("Dont::::: ", result);
  //     res.send(results);
  //   });
  // },

  storeClip: function(req, res) {
    // Declaring Variables
    var email = req.body.email;
    // Img url to send to DB
    var clipUrl = req.body.url;
    var title = req.body.title;
    var category;
    var suggestionResults;
    //if this promise resolves, the user is valid, and they don't hae this clip
    var isUserisDup = new Promise(function(resolve, reject) {

      //cypher for returning a user with some email
      var isuserCypher = "MATCH (usernode:User {email:" + '"' + email + '"' + "}) RETURN usernode";

      //cypher for find if a clip (defined by title) already exists for a specified user (defined by email)
      var isdupCypher = "MATCH (usernode:User {email:" +
        '"' + email + '"' + "})<--(clipnode:Clip {title:" + '"' + title + '"' + "}) RETURN clipnode";

      db.query(isuserCypher, function(err, res) {
        //first check if a user exists with that email
        if (res.length === 0) {
          //if not then reject the promise
          console.log('user does not exist');
          reject("NO USER");
        } else {
          //now user is acertained, check to see if they already have this clip
          db.query(isdupCypher, function(err, res) {
            var flag = false
            for (var i = 0; i < res.length; i++) {
              if (res[i].title === title) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              resolve(flag)
            } else {
              console.log('error: this user already has this clip');
              reject("DUP CLIP FOR USER");
            }
          });

        }
      })
    }).then(function(val) {
      console.log('loading corpus & classifiying clip...');
      natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
        console.log(classifier.classify(req.body.text));
        category = classifier.classify(req.body.text);
        res.send("Clip added to: " + category);
        makeImg(clipUrl);
      });
    }).catch(function(error) {

      if (error === "DUP CLIP FOR USER") {
        res.send("hey, you already have this clip!")
      } else {
        res.send('sorry, user not found')
      }
    });

    function makeImg(clipUrl) {
      utils.urlToImage(clipUrl, function(imgUrl) {
        //saveToDB(imgUrl)
        saveToDbNoWatson(imgUrl);
      });
    };

    function saveToDbNoWatson(imgUrl) {


      var createClipNode = new Promise(function(resolve, reject) {
        db.save({
          clipUrl: req.body.url,
          title: req.body.title,
          imgUrl: imgUrl,
          clickCount: 0,
          text: req.body.text,
          category: category,
          timeAdded: req.body.timeAdded
        }, function(err, clipNode) {
          //returns the clipNode if ressolved correctly
          resolve(clipNode);
          reject(err);
        });
      }).then(function(clipNode) {
        //label the clip node
        db.label(clipNode, ['Clip'], function(err) {});
        return clipNode;
      }).then(function(clipNode) {
        //extract keywords
        var clipKeywords = extractKeywordsNoWatson(clipNode);
        console.log('we have keywords', clipKeywords);

        clipKeywords.forEach(function(element, ind, array) {
          //create node for each keyword
          utils.storeTags(element, function(tagNode, relevance) {
            //create relations for each keyword node
            utils.createRelation(clipNode, tagNode, 'contains', relevance, function(fromnode) {
              // console.log('relationship created');
            });
          });

        });
        return clipNode;
      }).then(function(clipNode) {
        //find the user in the db based on their email
        utils.fetchUserByEmail(email, function(userNode) {
          //create relation: user->clip
          utils.createRelation(clipNode, userNode, 'owns', 'owns', function(fromNode) {});
        });
        return clipNode;
      }).then(function(clipNode) {
        //Remove stopWords, and then get suggestions for each node with the first two words
        var parsedTitle = keyword_extractor.extract(clipNode.title, {
          language: "english",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: false
        }).slice(0, 2).join(' ');

        console.log('PARSED TITLE---------------->>>>>>', parsedTitle);

        utils.suggestionsAPI(parsedTitle, function(suggestions) {
          console.log('TIME TO GET SUGGESTIONS:', suggestions.results);
          suggestionResults = suggestions.results.map(function(item) {
            // console.log("suggestionResults: ", item);
            return {
              title: item.title,
              url: item.url
            };
          });

          suggestionResults.forEach(function(element, ind, array) {
            // console.log('INSIDE SuggestionResults FOREACH:', element);
            utils.createSuggestionNode(element, function(suggestionNode) {
              utils.createRelation(clipNode, suggestionNode, 'related', 'related', function(clipNode) {});
            });

          });

        });
      });
    }

    function extractKeywordsNoWatson(clipNode) {
      var text = clipNode.text
        //load an instance of term freq - inverse term freq instance
      TfIdf = natural.TfIdf,
        tfidf = new TfIdf();

      //add the document from the node.text - this represents the doc in feature space
      tfidf.addDocument(text)

      //get all terms
      var results = tfidf.listTerms(0);

      //sort terms by term freq * inverse term freq
      results.sort(function(a, b) {
        return b.tfidf - a.tfidf;
      });

      //return top 10
      return results.slice(0, 3);
    }
  }
};