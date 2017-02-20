(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = [
    '$scope'
  ];

  function DashboardCtrl($scope) {
    $scope.title = 'Estado de cuenta';
  }

})();
