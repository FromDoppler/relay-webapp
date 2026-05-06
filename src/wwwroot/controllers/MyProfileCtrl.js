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
    vm.verifyEmailOtp = verifyEmailOtp;
    vm.resendEmailOtp = resendEmailOtp;
    vm.startEmailChange = startEmailChange;
    vm.resetPasswordContainer = resetPasswordContainer;
    vm.resetUsernameContainer = resetUsernameContainer;
    vm.username = auth.getUserName();
    vm.canChangePassword = auth.canChangePassword();
    vm.canChangeEmail = auth.canChangeEmail();
    vm.useClerkAuth = RELAY_CONFIG.useClerkAuthentication || false;
    vm.passwordValidationError = null;
    vm.emailChangeStep = null;
    vm.emailOtp = null;
    vm.emailChangeError = null;
    vm.emailOtpError = null;
    vm.emailChangeSuccess = false;
    vm.emailResendSuccess = false;
    vm.pendingNewEmail = null;
    vm.twoFactorRequiredMessage = null;

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

              if (result.currentPasswordIncorrect) {
                vm.wrongOldPassword = true;
                return;
              }

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

    function startEmailChange() {
      vm.twoFactorRequiredMessage = null;

      if (!vm.useClerkAuth) {
        vm.showUserNameContainer = true;
        return;
      }

      clerk.hasTwoFactorEnabled()
        .then(function(enabled) {
          if (enabled) {
            vm.showUserNameContainer = true;
          } else {
            vm.twoFactorRequiredMessage = $translate.instant('two_factor_required_for_action');
          }
        });
    }

    function changeUsername(form) {
      vm.usernameSubmitted = true;
      vm.existingEmail = false;
      vm.emailChangeError = null;

      if (!form.$valid) {
        return;
      }

      var useClerkAuth = RELAY_CONFIG.useClerkAuthentication || false;

      if (useClerkAuth) {
        clerk.hasTwoFactorEnabled()
          .then(function(enabled) {
            if (!enabled) {
              vm.emailChangeError = $translate.instant('two_factor_required_for_action');
              return;
            }
            return clerk.createEmailAddress(form.username.$modelValue)
              .then(function(result) {
                if (!result.success) {
                  if (result.emailAlreadyExists) {
                    vm.existingEmail = true;
                    return;
                  }
                  if (result.invalidFormat) {
                    vm.emailChangeError = $translate.instant('change_email_invalid_format');
                    return;
                  }
                  vm.emailChangeError = result.error || $translate.instant('change_email_error');
                  return;
                }

                vm.emailChangeStep = 'otp';
                vm.pendingNewEmail = form.username.$modelValue;
              });
          })
          .catch(function(error) {
            vm.emailChangeError = $translate.instant('change_email_error');
          });
      } else {
        settings.requestEmailChange(form.username.$modelValue, $translate.use())
          .then(function() {
            vm.emailActivationPending = true;
            resetUsernameContainer();
          })
          .catch(function(rejectionData) {
            var data = rejectionData.data || {};
            if (data.errorCode == 7 && data.status == 400) {
              vm.existingEmail = true;
            } else {
              $rootScope.addError('action_updating_email', data.detail, data.title, data.status, data.errorCode);
            }
          });
      }
    }

    function verifyEmailOtp() {
      vm.emailOtpError = null;

      if (!vm.emailOtp || vm.emailOtp.length !== 6) {
        return;
      }

      clerk.verifyEmailChange(vm.emailOtp)
        .then(function(result) {
          if (!result.verified) {
            if (result.codeIncorrect) {
              vm.emailOtpError = $translate.instant('otp_error_code_incorrect');
              return;
            }
            if (result.verificationExpired) {
              vm.emailOtpError = $translate.instant('otp_error_code_expired');
              return;
            }
            vm.emailOtpError = result.error || $translate.instant('otp_error_code_general');
            return;
          }

          var newEmail = vm.pendingNewEmail;
          return auth.syncEmail(newEmail)
            .then(function() {
              return clerk.getToken();
            })
            .then(function(newToken) {
              auth.loginByToken(newToken);
              resetUsernameContainer();
              vm.username = newEmail;
              $rootScope.$broadcast('emailChanged', newEmail);
              vm.emailChangeSuccess = true;
              $timeout(function() {
                vm.emailChangeSuccess = false;
              }, 3000);
            })
            .catch(function(error) {
              vm.emailOtpError = $translate.instant('change_email_db_error');
            });
        })
        .catch(function(error) {
          vm.emailOtpError = $translate.instant('change_email_error');
        });
    }

    function resendEmailOtp() {
      vm.emailResendSuccess = false;
      clerk.resendEmailChangeOtp()
        .then(function(result) {
          if (result.sent) {
            vm.emailResendSuccess = true;
            return;
          }
          vm.emailOtpError = $translate.instant('otp_error_code_resend_error');
        })
        .catch(function(error) {
          vm.emailOtpError = $translate.instant('otp_error_code_resend_error');
        });
    }

    function resetUsernameContainer(){
      vm.showUserNameContainer = false;
      vm.existingEmail = false;
      vm.emailChangeStep = null;
      vm.emailOtp = null;
      vm.emailChangeError = null;
      vm.emailOtpError = null;
      vm.emailResendSuccess = false;
      vm.pendingNewEmail = null;
      vm.twoFactorRequiredMessage = null;
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
