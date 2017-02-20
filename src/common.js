'use strict';

var env = require('./env.json');

exports.config = function() {
  var nodeEnv = process.env.NODE_ENV || 'development';

  // Extended configurations
  env[nodeEnv].env = nodeEnv;
  env[nodeEnv].port = process.env.PORT || 3000;

  return env[nodeEnv];
};
