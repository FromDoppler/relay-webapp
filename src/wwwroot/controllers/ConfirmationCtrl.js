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
    'utils',
    'INDUSTRIES',
    'COUNTRIES'
  ];

  function ConfirmationCtrl($translate, signup, auth, $location, $rootScope, $q, utils, INDUSTRIES, COUNTRIES) {
    var vm = this;
    var currentLanguage = $translate.use();
    vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
    vm.regexPhoneNumber = "^\\+?([0-9][\\s-]?(\\([0-9]+\\))*)+[0-9]$";
    vm.submitted = false;
    vm.name = $translate.instant('name_placeholder_confirmation');
    vm.updateValidation = updateValidation;
    vm.submitActivation = submitActivation;
    vm.activationPromise = activate();
    vm.passwordEmpty = false;
    vm.termsAccepted = false;

    vm.industryList = INDUSTRIES.map(function(val){
        return { code: val.code, name: val[currentLanguage] };
    });

    vm.countryList = COUNTRIES.map(function(val){
        return { code: val.code, name: val[currentLanguage] }
    });

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
      } else if (form.pass.$modelValue != form.confpass.$modelValue) {
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
      var pass = form.pass.$modelValue || null;
      var checkTerms = form.checkTerms ? $rootScope.getTermsAndConditionsVersion() : null;
      signup.activateUser(apiKey, form.domain.$modelValue, userName, pass, $translate.use(), form.industry.$modelValue.code, form.phoneNumber.$modelValue, form.country.$modelValue.code, checkTerms)
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
