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
    '$scope'
  ];

  function ConfirmationCtrl($translate, signup, auth, $location, $rootScope, $q, utils, $scope) {
    var vm = this;
    var industriesPromise = signup.getIndustries();
    var countriesPromise = signup.getCountries();

    vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
    vm.regexPhoneNumber = "^\\+?([0-9][\\s-]?(\\([0-9]+\\))*)+[0-9]$";
    vm.submitted = false;
    vm.name = $translate.instant('name_placeholder_confirmation');
    vm.updateValidation = updateValidation;
    vm.submitActivation = submitActivation;
    vm.activationPromise = activate();
    vm.passwordEmpty = false;
    vm.termsAccepted = false;
    vm.industryList = [];
    vm.countryList = [];

    var deregisterLangListener = $rootScope.$on('$translateChangeSuccess', fillList);
    //Clean up
    $scope.$on('$destroy', deregisterLangListener);

    function fillList() {
      var lang = $translate.use();
      industriesPromise.then(function(ret) {
        vm.industryList = ret.data.map(function(val){
          return { code: val.code, name: val[lang] };
        })
      });

      countriesPromise.then(function(ret) {
        vm.countryList = ret.data.map(function(val){
          return { code: val.code, name: val[lang] };
        })
      });
    }

    function activate() {
      fillList();
      
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
      return signup.activateUser(apiKey, form.domain.$modelValue, userName, pass, $translate.use(), form.industry.$modelValue.code, form.phoneNumber.$modelValue, form.country.$modelValue.code, checkTerms)
        .then(function (result) {
          $rootScope.isNewUser = true;
          var credentials = {
            username: userName,
            password: form.pass.$modelValue
          };

          return auth.login(credentials).then(function (result) {
            if (result.authenticated) {
              $location.path('/');
            }
          });
        });
    }
  }
})();
