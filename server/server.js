/**

 *Server Configuration File

**/

//External Resources
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var Promise= require('bluebird');
var db = require('neo4j-simple')("http://localhost:3000",{
	idName: 'id'
});


var app = express();

app.use(express.static(__dirname + '../../app'));


var userNode= db.defineNode({
	label: ['User'],
	schema:{
		'userName': db.Joi.string().min(8).max(15).required(),
		'password': db.Joi.string().min(6).max(10).required(),
		'email': db.Joi.string().email().required()
	}
});

var cliprNode= db.defineNode({
	label: ['Clip'],
	schema:{
		'siteUrl': db.Joi.string().required(),
		'mediaUrl': db.Joi.string().optional(),
		'title': db.Joi.string().max(20).required()
	}
});

var categoryNode= db.defineNode({
	label: ['Category'],
	schema:{
		'category': db.Joi.string().required()
	}
});

var topicNode= db.defineNode({
	label: ['Topic'],
	schema:{
		'topic': db.Joi.string().required()
	}
});

var siteToUser= db.defineRelationship({
	type: 'bookmark',
	schema:{
		'description': db.Joi.string()
	}
});

var categoryToSite= db.defineRelationship({
	type: 'subject',
	schema:{
		'relevancy': db.Joi.number().integer(),
		'sentiment': db.Joi.string()
	}
});

var topicToCategory= db.defineRelationship({
	type: 'subject',
	schema:{
		'contains': db.Joi.string(),
		'relevancy': db.Joi.number().integer()
	}
});


//you can pass in an operation ("Create", "Replace", "Update")
//check out rainbird to see queries



app.listen(port);
console.log('Bits please server is now running at ' + port);