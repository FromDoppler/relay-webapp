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
      { text: 'plans_text', url: 'settings/plans', active: false },
      { text: 'billing_text', url: 'settings/billing', active: false }
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
      })
      .catch(function(rejectionData){
        if (rejectionData.data.errorCode == 2 && rejectionData.data.status == 401) {
          vm.wrongOldPassword = true;
        } else {
          $rootScope.addError('action_updating_password', rejectionData.data.detail, rejectionData.data.title, rejectionData.data.status, rejectionData.data.errorCode);
        }
      });
    }
  }

})();
