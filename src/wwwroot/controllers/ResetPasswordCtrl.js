(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

  ResetPasswordCtrl.$inject = [
    '$translate',
    '$routeParams',
    'auth',
    '$location',
    '$rootScope',
    '$q',
    '$scope',
    'utils'
  ];

  function ResetPasswordCtrl($translate, $routeParams, auth, $location, $rootScope, $q, $scope, utils) {
    var vm = this;
    vm.activationPromise = activate();
    vm.submitted = false;
    vm.username = auth.getUserName(); // It is to allow browser to identify the user on update password
    vm.submitResetPassword = submitResetPassword;
    vm.updateValidation = updateValidation;

    function activate() {
      return $q.resolve();
    }

    function submitResetPassword() {
      vm.submitted = true;
      if ($scope.form.$invalid) {
        return;
      }

      auth.resetPassword($scope.resetPassword, $translate.use())
        .then(function () {
          var credentials = {
            username: vm.username,
            password: $scope.resetPassword
          };

          auth.login(credentials).then(function (result) {
            if (result.authenticated) {
              $location.path('/');
            }
          });
        });
    }

    function updateValidation() {
      if (!$scope.resetPassword || !$scope.resetPasswordConf) {
        $scope.form.resetPasswordConf.$setValidity('same', null);
      } else if ($scope.resetPassword != $scope.resetPasswordConf) {
        $scope.form.resetPasswordConf.$setValidity('same', false);
      } else {
        $scope.form.resetPasswordConf.$setValidity('same', true);
      }
    }
  }
})();
