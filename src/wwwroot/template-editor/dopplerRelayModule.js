'use strict';
// Create dopplerRelay module out of the scope of webapp to get environment constants
angular
  .module('dopplerRelay', []);
// Add dopplerRelay module to take environment configuration constant
angular
  .module("mseditor").requires.push('dopplerRelay');