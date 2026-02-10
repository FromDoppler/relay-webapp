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
    '$timeout',
    'settings',
    'clerk',
    'RELAY_CONFIG'
  ];

  function MyProfileCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, clerk, RELAY_CONFIG, $http) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: true },
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: false },
      { text: 'submenu_my_billing_information', url: 'settings/my-billing-information', active: false }
    ]);
    vm.changePassword = changePassword;
    vm.updateValidation = updateValidation;
    vm.changeUsername = changeUsername;
    vm.resetPasswordContainer = resetPasswordContainer;
    vm.resetUsernameContainer = resetUsernameContainer;
    vm.username = auth.getUserName();
    vm.useClerkAuth = RELAY_CONFIG.useClerkAuthentication || false;
    vm.passwordValidationError = null;

    function updateValidation(form) {
      if (!form.pass.$modelValue || !form.confPass.$modelValue) {
        form.confPass.$setValidity('same', null);
      } else if (form.pass.$modelValue != form.confPass.$modelValue) {
        form.confPass.$setValidity('same', false);
      } else {
        form.confPass.$setValidity('same', true);
      }
    }

    function changePassword(form) {
      vm.passSubmitted = true;
      vm.passwordValidationError = null;

      if (form.pass.$modelValue != form.confPass.$modelValue || !form.$valid) {
        return;
      }

      var useClerkAuth = RELAY_CONFIG.useClerkAuthentication || false;

      if (useClerkAuth) {
        clerk.updatePassword(form.oldPass.$modelValue, form.pass.$modelValue)
          .then(function(result) {

            if (!result.success) {
              console.log('Password update in Clerk failed');

              // Handle current password incorrect
              if (result.currentPasswordIncorrect) {
                vm.wrongOldPassword = true;
                return;
              }

              // Handle specific password validation errors with translated messages
              if (result.passwordPwned) {
                vm.passwordValidationError = $translate.instant('change_password_pwned');
              } else if (result.passwordTooLong) {
                vm.passwordValidationError = $translate.instant('change_password_too_long');
              } else if (result.passwordTooShort) {
                vm.passwordValidationError = $translate.instant('change_password_too_short');
              } else if (result.passwordNotStrongEnough) {
                vm.passwordValidationError = $translate.instant('change_password_not_strong_enough');
              } else if (result.passwordMissingLowercase) {
                vm.passwordValidationError = $translate.instant('change_password_missing_lowercase');
              } else if (result.passwordMissingUppercase) {
                vm.passwordValidationError = $translate.instant('change_password_missing_uppercase');
              } else if (result.passwordMissingNumber) {
                vm.passwordValidationError = $translate.instant('change_password_missing_number');
              } else if (result.passwordMissingSpecialChar) {
                vm.passwordValidationError = $translate.instant('change_password_missing_special_char');
              } else if (result.newPasswordMatchesCurrent) {
                vm.passwordValidationError = $translate.instant('change_password_matches_current');
              } else if (result.newPasswordInvalid) {
                vm.passwordValidationError = $translate.instant('change_password_invalid_format');
              } else if (result.error) {
                vm.passwordValidationError = result.error;
              } else {
                vm.passwordValidationError = $translate.instant('change_password_error');
              }
              return;
            }

            return auth.syncPassword(form.pass.$modelValue)
              .then(function() {
                resetPasswordContainer();
                vm.changePasswordSuccess = true;
                $timeout(function(){
                  vm.changePasswordSuccess = false;
                }, 1500);
              })
              .catch(function(error) {
                var data = error.data || {};
                vm.passwordValidationError = $translate.instant('change_password_db_error');
              });
          })
          .catch(function(error) {
            vm.passwordValidationError = $translate.instant('change_password_error');
          });
      } else {
        auth.changePassword(form.oldPass.$modelValue, form.pass.$modelValue, $translate.use())
        .then(function() {
          resetPasswordContainer();
          vm.changePasswordSuccess = true;
          $timeout(function(){
            vm.changePasswordSuccess = false;
          }, 1500);
        })
        .catch(function(rejectionData){
          var data = rejectionData.data || { };
          if (data.errorCode == 2 && data.status == 401) {
            vm.wrongOldPassword = true;
          } else {
            $rootScope.addError('action_updating_password', data.detail, data.title, data.status, data.errorCode);
          }
        });
      }
    }

    function changeUsername(form) {
      vm.usernameSubmitted = true;
      vm.existingEmail = false;

      if (!form.$valid) {
        return;
      }
      
       settings.requestEmailChange(form.username.$modelValue, $translate.use())
        .then(function() {
          vm.emailActivationPending = true;
          resetUsernameContainer();
       })
       .catch(function(rejectionData){
         var data = rejectionData.data || { };
         if (data.errorCode == 7 && data.status == 400) {
           vm.existingEmail = true;
         } else {
           $rootScope.addError('action_updating_email', data.detail, data.title, data.status, data.errorCode);
         }
       });
      
    }

    function resetUsernameContainer(){
      vm.showUserNameContainer = false;
      vm.existingEmail = false;
      vm.username = auth.getUserName();
    }

    function resetPasswordContainer(){
      vm.showChangePassContainer = false;
      vm.pass = '';
      vm.oldPass = '';
      vm.confPass = '';
      vm.wrongOldPassword = false;
      vm.passwordValidationError = null;
    }
  }

})();
