'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');

// Middleware to parse the JSON body configure app to use bodyParser() this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Bootstrap application

function setting(app, rootPath) {
  // Register app
  app.dopplerRelay = {
    rootPath: rootPath,
    controllers: {}
  };
  // Register configuration
  app.dopplerRelay.config = require('./common').config();

  return app.dopplerRelay;
};
var dopplerRelay = setting(app, path.resolve(__dirname));

// Serve static content
app.use(express.static(__dirname + '/' + dopplerRelay.config.dist + '/'));

// Serve root
app.get('/', function(req, res) {
  res.status(200).sendfile(__dirname + '/' + dopplerRelay.config.dist + '/index.html');
});

// Use morgan to log requests in the console
app.use(morgan('dev'));

// Start listening
http.listen(dopplerRelay.config.port, function() {
  console.log('ENV: ' + dopplerRelay.config.env);
  console.log('Listening on port: ' + dopplerRelay.config.port);
});
