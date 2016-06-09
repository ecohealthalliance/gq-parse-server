var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var settings = require('./settings');

process.env.VERBOSE=true;

var app = express();
var api = new ParseServer(settings);

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

var port = 1337;
app.listen(port, function() {
  console.log('parse-server-example running on port ' + port + '.');
});
