(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('HeaderCtrl', HeaderCtrl);
  HeaderCtrl.$inject = [
    '$scope',
    '$translate',
    '$location',
    '$rootScope'
  ];

  function HeaderCtrl($scope, $translate, $location, $rootScope) {
    $scope.changeLanguage = function (key) {
      $translate.use(key);
      $rootScope.languageChanged(key);
    };
    $scope.arrowUp = false;
    $scope.toggleConfigDropDown = function () {
      $scope.arrowUp = !$scope.arrowUp;
    };
    $scope.hideConfigDropDown = function () {
      if ($scope.arrowUp) {
        $scope.arrowUp = !$scope.arrowUp;
      }
    };
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
  }
})();
