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
    '$timeout',
    "Slug",
    '$location',
    'vcRecaptchaService'
  ];

  function RegistrationCtrl($scope, $rootScope, RELAY_CONFIG, signup, utils, $translate, $timeout, Slug, $location, recaptcha) {
    var vm = this;
    vm.submitRegistration = submitRegistration;
    vm.emailRegistered = null;
    vm.regexAllowedAccountName = /^[a-z-0-9_-]*$/;

    var customAccountName = false;
    vm.accountNameUpdated = function () {
      customAccountName = !!vm.accountName;
    }
    vm.companyUpdated = function() {
      if (!customAccountName) {
        vm.accountName = Slug.slugify(vm.company);
      }
    }
    vm.recaptchaAvailable = !!recaptcha;

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
        termsAndConditions: vm.checkTerms ? $rootScope.getTermsAndConditionsVersion() : null,
        recaptchaResponse: form.recaptchaResponse
      };

      var onExpectedError = function (rejectionData) {
        var handled = false;
        if (vm.recaptchaAvailable){
          recaptcha.reload();
        }
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
          $location.path('/signup/succeed?email='+ vm.email);
        });
    }
  }
})();
