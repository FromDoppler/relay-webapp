﻿(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = [
    '$scope',
    '$rootScope',
    'RELAY_CONFIG',
    'signup',
    'utils',
    '$translate',
    '$timeout'
  ];

  function RegistrationCtrl($scope, $rootScope, RELAY_CONFIG, signup, utils, $translate, $timeout) {
    var vm = this;
    vm.submitRegistration = submitRegistration;
    vm.emailRegistered = null;
    vm.regexAllowedAccountName = /^[a-z-0-9_-]*$/;

    function submitRegistration(form) {
      vm.submitted = true; // To show error messages
      if (form.$invalid) {
        return;
      }

      var user = {
        user_email: vm.email,
        firstName: vm.firstName,
        lastName: vm.lastName,
        password: vm.password,
        account_name: vm.accountName,
        company: vm.company,
        termsAndConditions: vm.checkTerms
      };

      var onExpectedError = function (rejectionData) {
        var handled = false;

        var accountNameError = rejectionData.errors.find(function (error) {
          return error.key == "account_name";
        });
        if (accountNameError) {
          handled = true;
          utils.setServerValidationToField($scope, $scope.form.accountName, 'accountname_already_taken');
        }

        var emailError = rejectionData.errors.find(function (error) {
          return error.key == "user_email";
        });
        if (emailError) {
          handled = true;
          utils.setServerValidationToField($scope, $scope.form.email, 'email_already_exist');
        }

        return handled;
      };

      signup.registerUser(user, $translate.use(), onExpectedError)
        .then(function (result) {
          vm.emailRegistered = user.user_email;
          utils.resetForm(vm,form);
          vm.submitted = false; // To avoid to show some error messages while submit is not pressed
          $timeout( function(){ vm.emailRegistered = null; }, 5000);
        });
    }
  }
})();
