// LOAD DEPENDENCIES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
// var router = require('./router.js');
var cookieParser = require('cookie-parser');

// INITIALIZE SERVER
var port = process.env.PORT || 3000;
var app = module.exports= express();
var routes= require('./router.js')


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


app.listen(port);
console.log('Bits please server is now running at ' + port);

