
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');

module.exports = function (passport) {

	//used to serialize the user from the session
	passport.serializeUser(function (user, done) {
		done(null, google.email);
	});

	//used to deserialize the user
	passport.deserialize(function (id, done) {
		db.find({ google.email : id }, function (err, user) {
			done(err, user);
		});
	});

	/**
		Google OAuth2
		Google Strategy will search for a user based on google.id and 
		correspond to their profile.id we get back from Google
	**/

	passport.use(new GoogleStrategy({

		clientID			: configAuth.googleAuth.clientID,
		clientSecret	: configAuth.googleAuth.clintSecret,
		callbackURL		: configAuth.googleAuth.callbackURL

		},
		function (token, refreshToken, profile, done) {

			//make the code asynchronous
			//User.findOne won't fire until we have all our data back from Google
			process.nextTick(function() {

				//try to find the user based on their google id
				db.find({ google.id : profile.id }, function (err, user) {
					if(err) {
						return done(err);
					}

					if(user) {
						//if a user is found, log them in
						return done(null, user);
					} else {
						db.save({
							google.id     : profile.id,
							google.token  : token,
							google.name		: profile.displayName,
							google.email	: profile.emails[0].value
						}, function (err, node) {
							if (err) {
								throw err;
							}
							db.label(node, ['User'], function (err) {
								if(err) { 
									throw err; 
								}
								console.log("User created " + node);
							});
						});
						//if the user isn't in our database, create a new user
						// var newUser = new User();

						// //set all of the relevant information
						// newUser.google.id 		= profile.id;
						// newUser.google.token  = token;
						// newUser.google.name		= profile.displayName;

						// //pull the first email
						// newUser.google.email	= profile.emails[0].value;

						//save the user
						// newUser.save(function (err) {
						// 	if(err) {
						// 		console.error('User wasn\'t able to be saved in DB');
						// 	}else {
						// 		return done(null, newUser);
						// 	}
						// });
					};
				});
			});
		}));
};
