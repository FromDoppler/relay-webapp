(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('HeaderCtrl', HeaderCtrl);
  HeaderCtrl.$inject = [
    '$scope',
    '$translate',
    '$location',
    '$rootScope',
    'utils',
    'RELAY_CONFIG',
    'auth'
  ];

  function HeaderCtrl($scope, $translate, $location, $rootScope, utils, RELAY_CONFIG, auth) {
    $scope.arrowUp = false;
    $scope.toggleConfigDropDown = function () {
      $scope.arrowUp = !$scope.arrowUp;
    };
    $scope.hideConfigDropDown = function () {
      if ($scope.arrowUp) {
        $scope.arrowUp = !$scope.arrowUp;
      }
    };
    $scope.useClerkAuth = RELAY_CONFIG.useClerkAuthentication;
    $scope.getSubmenues = $rootScope.getSubmenues;
    $scope.isSubmenuVisible = $rootScope.isSubmenuVisible;
    $scope.initialsAvatar = function () {
      var fullName = $rootScope.getFullName();
      if (!fullName) {
        return "?";
      }
      var match = fullName.match(/\b(\s)/g);
      if (!match) {
        return fullName.charAt(0);
      }
      return match.join('');
    }

    $scope.isImpersonating = function () {
      return auth.isImpersonating();
    };
  }
})();

