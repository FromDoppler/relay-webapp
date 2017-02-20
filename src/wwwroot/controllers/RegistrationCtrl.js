(function () {
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
    vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
    vm.emailRegistered = null;

    function reset(vm, form, defaultValues) {
      // TODO: consider to move it to a service
      var undefined = {}["undefined"]; // It is not a good practice to use the `undefined` because it is not a reserved word
      defaultValues = defaultValues || {}; // defaultValues is to allow to set default model values in place of null
      for (var name in form) {
        if (name.indexOf('$') !== 0) {
          var control = form[name];
          control.$setViewValue(undefined);
          vm[control.$name] = defaultValues[control.$name] || null;
        }
      }
      form.$setPristine();
      form.$setUntouched();
    }

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
        domain: vm.domain
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
          reset(vm, form);
          vm.submitted = false; // To avoid to show some error messages while submit is not pressed
          $timeout( function(){ vm.emailRegistered = null; }, 5000);
        });
    }
  }
})();
