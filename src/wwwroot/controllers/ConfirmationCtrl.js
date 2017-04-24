(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ConfirmationCtrl', ConfirmationCtrl);

  ConfirmationCtrl.$inject = [
    '$translate',
    'signup',
    'auth',
    '$location',
    '$rootScope',
    '$q',
    'utils'
  ];

  function ConfirmationCtrl($translate, signup, auth, $location, $rootScope, $q, utils) {
    var vm = this;
    vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
    vm.submitted = false;
    vm.name = $translate.instant('name_placeholder_confirmation');
    vm.updateValidation = updateValidation;
    vm.submitActivation = submitActivation;
    vm.activationPromise = activate();
    vm.passwordEmpty = false;
    vm.termsAccepted = false;

    function activate() {
      var activationToken = $location.search()['activation'];
      if (!activationToken) {
        redirectToError();
        return $q.resolve();
      }
      return getUserInfo(activationToken);
    }

    function redirectToError() {
      $location.path('/signup/error');
    }

    function getUserInfo(activationToken) {
      return signup.getUser(activationToken)
        .then(function (result) {
          if (result.getUserError || !result.data || !result.data.pending_activation) {
            return redirectToError();
          }
          vm.userName = result.data.user_email;
          vm.name = result.data.firstName || result.data.user_email;
          vm.domain = result.data.domain;
          vm.passwordEmpty = result.data.password_empty;
          vm.termsAccepted = result.data.terms_and_conditions_version;
          return getRealApiKey(activationToken);
        });
    }

    function getRealApiKey(activationToken) {
      signup.getApiKey(activationToken)
        .then(function (result) {
          if (result.getApiKeyError || !result.data) {
            return redirectToError();
          }
          vm.apiKey = result.data.api_key;
        });
    }

    function updateValidation(form) {
      if (!form.pass.$modelValue || !form.confpass.$modelValue) {
        form.confpass.$setValidity('same', null);
      } else if ($scope.resetPassword != $scope.resetPasswordConf) {
        form.confpass.$setValidity('same', false);
      } else {
        form.confpass.$setValidity('same', true);
      }
    }

    function submitActivation(form, userName, apiKey) {
      vm.submitted = true;
      if (!form.$valid) {
        return;
      }
      signup.activateUser(apiKey, form.domain.$modelValue, userName, form.pass.$modelValue, $translate.use(), form.industry.$modelValue, form.telephone.$modelValue, form.country.$modelValue, form.checkTerms.$modelValue)
        .then(function (result) {
          $rootScope.isNewUser = true;
          var credentials = {
            username: userName,
            password: form.pass.$modelValue
          };

          auth.login(credentials).then(function (result) {
            if (result.authenticated) {
              $location.path('/');
            }
          });
        });
    }
  }
})();
