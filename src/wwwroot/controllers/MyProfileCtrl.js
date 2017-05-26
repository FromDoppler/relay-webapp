(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('MyProfileCtrl', MyProfileCtrl);

  MyProfileCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout'
  ];

  function MyProfileCtrl($scope, $location, $rootScope, auth, $translate, $timeout) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: true },
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: false },
      { text: 'domains_text', url: 'settings/domain-manager', active: false }
    ]);
    vm.changePassword = changePassword;
    vm.updateValidation = updateValidation;

    function updateValidation(newPass, confNewPass) {
      if (!$scope.form.pass.$modelValue || !$scope.form.confPass.$modelValue) {
        $scope.form.confPass.$setValidity('same', null);
      } else if ($scope.form.pass.$modelValue != $scope.form.confPass.$modelValue) {
        $scope.form.confPass.$setValidity('same', false);
      } else {
        $scope.form.confPass.$setValidity('same', true);
      }
    }

    function changePassword(form) {
      vm.submitted = true;
      if (form.pass.$modelValue != form.confPass.$modelValue || !form.$valid) {
        return;
      }
      auth.changePassword(form.oldPass.$modelValue, form.pass.$modelValue, $translate.use())
      .then(function() {
        vm.showChangePassContainer = false;
        vm.changePasswordSuccess = true;
        $timeout(function(){
          vm.changePasswordSuccess = false;
        }, 1500);

      });
    }
  }

})();
