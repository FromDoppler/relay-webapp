(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('LoginCtrl', LoginCtrl);
  LoginCtrl.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'auth',
    '$translate'
  ];

  function LoginCtrl($scope, $location, $timeout, auth, $translate) {

    $scope.forgotOpened = false;
    $scope.forgotSuccessful = false;

    $scope.updateValidation = function () {
      if ($scope.loginform && $scope.loginform.email) {
        $scope.loginform.email.$setValidity('error', true);
      }
      if ($scope.loginform && $scope.loginform.password) {
        $scope.loginform.password.$setValidity('error', true);
      }
    }
    $scope.gotoBottom = function () {
      $scope.forgotOpened = !$scope.forgotOpened;
    };

    $scope.submitLogin = function () {
      if ($scope.loginform.$invalid) {
        return;
      }

      var credentials = {
        username: $scope.email,
        password: $scope.password
      };

      auth.login(credentials).then(function (result) {
        if (result.authenticated) {
          $location.path('/');
        } else {
          $scope.loginform.email.$setValidity('error', false);
          $scope.loginform.password.$setValidity('error', false);
        }
      });
    };

    $scope.removeSucceed = function () {
      if ($scope.forgotSuccessful) {
        $scope.forgotSuccessful = false;
      }
    }

    $scope.submitForgot = function () {
      if ($scope.forgotForm.$invalid) {
        return;
      }

      auth.forgotPassword($scope.forgotEmail, $translate.use())
        .then(function () {
            $scope.forgotSuccessful = true;
        })
    };
  }
})();
