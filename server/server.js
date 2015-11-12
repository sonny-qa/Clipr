/**

 *Server Configuration File

**/

//External Resources
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + '../../app'));

app.listen(port);
console.log('Bits please server is now running at ' + port);