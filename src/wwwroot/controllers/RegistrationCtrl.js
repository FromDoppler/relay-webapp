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
    'vcRecaptchaService',
    'clerk',
    'resources'
  ];

  function RegistrationCtrl($scope, $rootScope, RELAY_CONFIG, signup, utils, $translate, $timeout, Slug, $location, vcRecaptchaService, clerk, resources) {
    var vm = this;
    vm.submitRegistration = submitRegistration;
    vm.emailRegistered = null;
    vm.regexAllowedAccountName = /^(?=.*[a-z])[a-z0-9_-]*$/;
    vm.registrationInProgress = false;
    vm.setCaptchaResponse = setCaptchaResponse;
    vm.setWidgetId = setWidgetId;
    vm.reloadCaptcha = reloadCaptcha;
    vm.regexPhoneNumber = "^\\+?([0-9][\\s-]?(\\([0-9]+\\))*)+[0-9]$";

    var customAccountName = false;
    vm.accountNameUpdated = function () {
      customAccountName = !!vm.accountName;
    }
    vm.companyUpdated = function() {
      if (!customAccountName) {
        vm.accountName = Slug.slugify(vm.company);
      }
    }
    var useClerkAuth = RELAY_CONFIG.useClerkAuthentication || false;
    vm.recaptchaAvailable = !useClerkAuth && !!vcRecaptchaService;

    resources.ensureIndustries();
    resources.ensureCountries();
    vm.resources = resources.data;

    function submitRegistration(form) {
      vm.submitted = true; // To show error messages

      if (useClerkAuth) {
        validatePasswordConfirmation();
        if (form.$invalid) {
          return;
        }
        vm.registrationInProgress = true;
        registerWithClerk();
      } else {
        if (form.$invalid) {
          return;
        }
        vcRecaptchaService.execute(vm.widgetId);
      }
    }

    function registerWithClerk() {
      var newUser = {
        user_email: vm.email,
        password: vm.password,
        password_confirmation: vm.password_confirmation,
        firstName: vm.firstName,
        lastName: vm.lastName,
        account_name: vm.accountName,
        company: vm.company,
        termsAndConditions: vm.checkTerms ? $rootScope.getTermsAndConditionsVersion() : null,
        origin: $location.search().origin
      };

      var selectedCountry = $scope.form && $scope.form.country ? $scope.form.country.$modelValue : null;
      var selectedIndustry = $scope.form && $scope.form.industry ? $scope.form.industry.$modelValue : null;
      var countryCodePart = $scope.form && $scope.form.countryPhoneNumber ? ($scope.form.countryPhoneNumber.$modelValue || '') : '';
      var areaCodePart = $scope.form && $scope.form.areaPhoneNumber ? ($scope.form.areaPhoneNumber.$modelValue || '') : '';
      var phonePart = $scope.form && $scope.form.phoneNumber ? ($scope.form.phoneNumber.$modelValue || '') : '';

      newUser.country_code = selectedCountry ? selectedCountry.code : null;
      newUser.industry_code = selectedIndustry ? selectedIndustry.code : null;
      newUser.phone_number = countryCodePart + '-' + areaCodePart + '-' + phonePart;

      clerk.signUp(newUser)
        .then(function (result) {
          if (result.registered && result.needsVerification) {
            $location
              .path('/signup/otp-validation')
              .search({ process: 'signup' });
            return;
          }

          if (result.formIdentifierExists) {
            if (result.paramName === 'email_address') {
              utils.setServerValidationToField($scope, $scope.form.email, 'email_already_exist');
            } else if (result.paramName === 'username') {
              utils.setServerValidationToField($scope, $scope.form.accountName, 'accountname_already_taken');
            }
            return;
          }
          if (result.validationError) {
            if (result.passwordInvalid) {
              utils.setServerValidationToField($scope, $scope.form.password, 'strength');
            } else if (result.accountNameAlreadyTaken) {
              utils.setServerValidationToField($scope, $scope.form.accountName, 'accountname_already_taken');
            } else if (result.accountNameInvalid) {
              utils.setServerValidationToField($scope, $scope.form.accountName, 'accountname_invalid');
            } else if (result.emailAlreadyExists) {
              utils.setServerValidationToField($scope, $scope.form.email, 'email_already_exist');
            }
            return;
          }
        })
        .catch(function (error) {
          $rootScope.addError('error_handler_unexpected', 'action_register_user', error);
        })
        .finally(function () {
          vm.registrationInProgress = false;
        });
    }

    var onExpectedError = function (rejectionData) {
      var handled = false;
      if (vm.recaptchaAvailable){
        vcRecaptchaService.reload();
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

    function setWidgetId (widgetId) {
      vm.widgetId = widgetId;
    };

    function setCaptchaResponse(response) {
      var user = {
        user_email: vm.email,
        firstName: vm.firstName,
        lastName: vm.lastName,
        password: vm.password,
        account_name: vm.accountName,
        company: vm.company,
        termsAndConditions: vm.checkTerms ? $rootScope.getTermsAndConditionsVersion() : null,
        recaptchaResponse: response,
        origin: $location.search().origin,
        checkPromotions: vm.checkPromotions
      };

      signup.registerUser(user, $translate.use(), onExpectedError)
      .then(function (result) {
        /// Comenting this line until we have google analytics working correctly
        //$location.path('/signup/succeed').search({'email': vm.email});
        if ($translate.use() == 'es') {
          window.location.href="https://www.dopplerrelay.com/confirmacion";
        } else {
          window.location.href="https://www.dopplerrelay.com/en/confirmation";
        }
      }).catch(function (result){
        vm.forgotSuccessful = false;
      }).finally(function (){
        reloadCaptcha();
      });
    }

    function reloadCaptcha () {
      vcRecaptchaService.reload(vm.widgetId);
      vm.response = null;
    };

    function validatePasswordConfirmation() {
      if (!$scope.form || !$scope.form.password_confirmation) {
        return;
      }

      if (!vm.password || !vm.password_confirmation) {
        $scope.form.password_confirmation.$setValidity('same', null);
      } else if (vm.password !== vm.password_confirmation) {
        $scope.form.password_confirmation.$setValidity('same', false);
      } else {
        $scope.form.password_confirmation.$setValidity('same', true);
      }
    }
  }
})();
