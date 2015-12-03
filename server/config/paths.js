var utils = require('./utils.js');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var app = require('../server.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var natural = require('natural');



var express = require('express');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var classifier = require('./classify.js')
    // var router = require('./router.js');
var natural = require('natural')
    // var router = require('./router.js');


// Set website (Heroku or Localhost) and callbackURL
var website = (process.env.SITE || "http://localhost:3000");
var callbackURL = website + '/auth/google/callback';

if (website === "http://localhost:3000") {
    var keysAndPassword = require('../../apiKeysAndPasswords.js');
}

// Used in Google OAuth
var passport = require('passport');
var clientID = process.env.clientID || keysAndPassword.clientID;
var clientSecret = process.env.clientSecret || keysAndPassword.clientSecret;

var passport = require('passport');
/**
  Google OAuth2
**/


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
    console.log('looking for gid', profile)
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

app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/#/landing'
    }),
    function(req, res) {
        console.log('req', req)
        console.log('res', res)
            //when they come back after a successful login, setup clipr cookie
        var email = req.session.passport.user.email

        res.cookie('clipr', email)

    // Successful authentication, redirect home.
    res.redirect('/#/categories');
  })

var db = require('seraph')({
    server: "http://clipr.sb02.stations.graphenedb.com:24789",
    user: "clipr",
    pass: 'oSvInWIWVVCQIbxLbfTu'

});

module.exports = {


    //   db: require('seraph')({
    //   server: "http://clipr.sb02.stations.graphenedb.com:24789",
    //   user: "clipr",
    //   pass: 'oSvInWIWVVCQIbxLbfTu'
    // }),

    googleAuth: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'email']
        },
        function(req, res) {
            //send user to google to authenticate

        }),



    storeClip: function(req, res) {
        // Declaring Variables
        var email = req.body.email;
        // Img url to send to DB
        var clipUrl = req.body.url;
        var title = req.body.title;
        var category;
        natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
            console.log(classifier.classify(req.body.text))
            category = classifier.classify(req.body.text);
            makeImg(clipUrl);
        });
        // Calling urlToImage function on image url
        // This img gets sent to Cloudinary for storage
        // var img = utils.urlToImage(imgUrl)
        // img.then(function(result) {
        //   console.log("Im in storeClip on server side: ", result);  
        // });

        function makeImg(clipUrl) {
            utils.urlToImage(clipUrl, function(imgUrl) {
                //saveToDB(imgUrl)
                saveToDbNoWatson(imgUrl)
            });
        };

        makeImg(clipUrl);

        //****  THIS IS KEPT AS BACKUP NOW ******//

        // function saveToDB(imgUrl) {
        //     console.log("imgUrl inside saveToDB: ", imgUrl);
        //     db.save({
        //         clipUrl: req.body.url,
        //         title: req.body.title,
        //         imgUrl: imgUrl,
        //         text: req.body.text
        //     }, function(err, clipNode) {
        //         if (err) throw err;
        //         db.label(clipNode, ['Clip'], function(err) {
        //             if (err) throw err;
        //             console.log(clipNode + " was inserted as a Clip into DB");
        //             //at this point we have the clip node created, so find the user and relate clip->user
        //             utils.fetchUserByEmail(email, function(userNode) {
        //                 utils.createRelation(clipNode, userNode, 'owns', 'owns', function(fromNode) {})
        //             });
        //             //query watson, and loop over top 3 results creating a keyword node for each
        //             utils.createWatsonUrl(clipNode.clipUrl, function(keywords) {
        //                 for (var i = 0; i < 3; i++) {
        //                     utils.storeTags(keywords[i], function(tagNode, relevance) {
        //                         //create relationship between each keyword node and the clip node
        //                         utils.createRelation(clipNode, tagNode, 'contains', relevance, function(fromNode) {
        //                             console.log('relationship between clip & tag node created')

        //                         });
        //                     });
        //                 }
        //             });
        //         });
        //     })
        // };

        
        function saveToDbNoWatson(imgUrl) {
            console.log('insidesavetoDBnoWatson')

            var createClipNode = new Promise(function(resolve, reject) {
                db.save({
                    clipUrl: req.body.url,
                    title: req.body.title,
                    imgUrl: imgUrl,
                    text: req.body.text,
                    category: category
                }, function(err, clipNode) {
                    //returns the clipNode if ressolved correctly
                    resolve(clipNode)
                    reject(err)
                })
            }).then(function(clipNode) {
                //label the clip node
                db.label(clipNode, ['Clip'], function(err) {})
                return clipNode
            }).then(function(clipNode) {
                //extract keywords
                var clipKeywords = extractKeywordsNoWatson(clipNode)
                console.log('we have keywords', clipKeywords)

                clipKeywords.forEach(function(element, ind, array) {
                    //create node for each keyword 
                    utils.storeTags(element, function(tagNode, relevance) {
                        //create relations for each keyword node
                        utils.createRelation(clipNode, tagNode, 'contains', relevance, function(fromnode) {
                            console.log('relationship created')
                        })
                    })

                })
                return clipNode
            }).then(function(clipNode) {
                //find the user in the db based on their email
                utils.fetchUserByEmail(email, function(userNode) {
                    //create relation: user->clip
                    utils.createRelation(clipNode, userNode, 'owns', 'owns', function(fromNode) {
                        console.log('relation created from:', fromNode)
                    })

                })
            })


        };

        function extractKeywordsNoWatson(clipNode) {
            var text = clipNode.text

            TfIdf = natural.TfIdf,
                tfidf = new TfIdf();

            //add the document from the node
            tfidf.addDocument(text)

            //get all terms
            var results = tfidf.listTerms(0)

            //sort terms by term freq * inverse term freq
            results.sort(function(a, b) {
                return b.tfidf - a.tfidf
            })

            //return top 10  
            return results.slice(0, 10)

        }
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
        console.log('COOKIES', req.query.cookie);
        var cypher = "MATCH(clips:Clip)-[:owns]->(user:User)WHERE user.email='" + req.query.cookie + "'RETURN clips";
        db.query(cypher, function(err, results) {
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