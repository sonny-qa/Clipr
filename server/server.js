// LOAD DEPENDENCIES
var compression = require('compression');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
// var router = require('./router.js');
var cookieParser = require('cookie-parser');
var classifier= require('./config/classify.js')
var urlToImage = require('url-to-image');




// INITIALIZE SERVER
var port = process.env.PORT || 3000;
var app = module.exports= express();
var routes = require('./router.js')


// classifier.trainClassifier();
app.use(compression());
app.use(express.static(__dirname + '../../app/dist'));

app.listen(port);
console.log('Bits please server is now running at ' + port);

