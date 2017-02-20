'use strict';

describe('MainCtrl', function() {
  beforeEach(module('dopplerRelay'));

  var $controller;
  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.someFunction', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('MainCtrl', { $scope: $scope });
    });
  });
});
