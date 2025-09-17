(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .factory('clerk', clerk);

  clerk.$inject = ['$window', '$q', '$rootScope', '$http', 'RELAY_CONFIG', 'utils', '$translate'];

  function clerk($window, $q, $rootScope, $http, RELAY_CONFIG, utils, $translate) {
    var _clerkInstancePromise = null;
    var _pendingUserRegistration = null;
    var _currentLanguageLoaded = null;

    init();
    
    return {
      login: login,
      signUp: signUp,
      verifyOtp: verifyOtp,
      resendOtp: resendOtp,
      getToken: getToken,
      logout: logout,
      mountUserButton: mountUserButton,
      isAuthenticated: isAuthenticated
    };
    
    function init() {
      _instance();
    }
    
    function _instance() {
      var preferredLang = utils.getPreferredLanguage() || 'en';

      if (_clerkInstancePromise && _currentLanguageLoaded === preferredLang) {
        return _clerkInstancePromise;
      }

      var deferred = $q.defer();
      _clerkInstancePromise = deferred.promise;

      var loadOptions = {};
      try {
        if (preferredLang && preferredLang.toLowerCase().indexOf('es') === 0 && $window.Clerk) {
          var localizationFromWindow = ($window.Clerk.localizations && $window.Clerk.localizations.es) || null;
          if (localizationFromWindow) {
            loadOptions.localization = localizationFromWindow;
            _currentLanguageLoaded = 'es';
          } else {
            _currentLanguageLoaded = 'en';
          }
        }
      } catch (e) {
        // Ignore localization errors; fallback to English
        _currentLanguageLoaded = 'en';
      }

      $window.Clerk.load(loadOptions)
        .then(function() {
          deferred.resolve($window.Clerk);
        })
        .catch(function(error) {
          _clerkInstancePromise = null;
          deferred.reject('Failed to load Clerk: ' + error);
        });

      return deferred.promise;
    }

    function _getApiKey(token) {
      return $http({
        actionDescription: 'action_get_temp_api_key',
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/apikeys',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'token ' + token
        }
      })
    }

    function login(credentials) {
      return _instance().then(function(clerk) {
        return clerk.client.signIn
          .create({ identifier: credentials.username, password: credentials.password })
          .then(function (res) {
            if (res.status === 'needs_second_factor') {
              if (res.supportedSecondFactors.map(function(sf) { return sf.strategy; }).includes('totp')) {
                return { needsSecondFactor: true, totp: true };
              }
            }

            if (res.status === 'complete') {
              return clerk.setActive({ session: res.createdSessionId }).then(function () {
                return clerk.session.getToken({ template: 'legacy-api' }).then(function (token) {
                  return { authenticated: true, token: token };
                });
              });
            }
            return { authenticated: false };
          })
          .catch(function (err) {
            if (err && err.clerkError && Array.isArray(err.errors) && err.errors.length > 0) {
              var first = err.errors[0];
              var result;
              switch (first.code) {
                case 'form_password_incorrect':
                  result = { authenticated: false };
                  break;
                case 'form_identifier_not_found':
                  result = { clientAccountNotFound: true };
                  break;
                default:
                  result = { authenticated: false };
                  break;
              }
              $rootScope.$applyAsync();
              return result;
            }
            return $q.reject(err);
          });
      });
    }

    function signUp(newUser) {
      _pendingUserRegistration = angular.copy(newUser);
      return $http({
        avoidStandarErrorHandling: true,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/validation',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'user_email': newUser.user_email,
          'firstName': newUser.firstName,
          'lastName': newUser.lastName,
          'password': newUser.password,
          'account_name': newUser.account_name,
          'company_name': newUser.company || null,
          'country_code': newUser.country_code || null,
          'industry_code': newUser.industry_code || null,
          'phone_number': newUser.phone_number || null,
          'terms_and_conditions_version': newUser.termsAndConditions,
          'origin': newUser.origin || null
        }
      })
      .then(function () {
        return _instance().then(function (clerk) {
          return clerk.client.signUp
            .create({
              email_address: newUser.user_email,
              first_name: newUser.firstName,
              last_name: newUser.lastName,
              password: newUser.password,
              unsafeMetadata: {
                company: newUser.company || null,
                account_name: newUser.account_name
              }
            })
            .then(function (res) {
              if (res.status === 'complete') {
                return { registered: true };
              }

              if (
                res.status === 'missing_requirements' &&
                Array.isArray(res.unverifiedFields) &&
                res.unverifiedFields.includes('email_address')
              ) {
                return res.prepareEmailAddressVerification({ strategy: 'email_code' }).then(function() {
                  return { registered: true, needsVerification: true };
                });
              }

              if (
                res.status === 'missing_requirements' &&
                Array.isArray(res.missingFields) &&
                res.missingFields.length > 0
              ) {
                return { registered: false, missingFields: res.missingFields };
              }

              return { registered: false, error: 'Unexpected response', details: res };
            })
            .catch(function (err) {
              var result = { registered: false };
              if (err && err.clerkError && Array.isArray(err.errors) && err.errors.length > 0) {
                var first = err.errors[0];
                switch (first.code) {
                  case 'form_identifier_exists':
                    result.formIdentifierExists = true;
                    result.paramName = first.meta.paramName;
                    break;
                  //TODO: add default case
                }
              }
              $rootScope.$applyAsync();
              return result;
            });
        });
      })
      .catch(function(err) {
        var result = {
          registered: false,
          validationError: true,
          errors: []
        };

        if (err && err.status === 400 && err.data && Array.isArray(err.data.errors)) {
          result.errors = err.data.errors;

          err.data.errors.forEach(function(error) {
            switch (error.key) {
              case 'password':
                result.passwordInvalid = true;
                break;
              case 'account_name':
                var detail = (error.detail || '').toLowerCase();
                if (detail.indexOf('already taken') !== -1) {
                  result.accountNameAlreadyTaken = true;
                } else {
                  result.accountNameInvalid = true;
                }
                break;
              case 'user_email':
                result.emailAlreadyExists = true;
                break;
            }
          });
        } else {
          return $q.reject(err);
        }

        $rootScope.$applyAsync();

        return result;
      });
    }

    function _registerUserInRelay(clerkUserId) {
      if (!_pendingUserRegistration) {
        return $q.resolve();
      }

      return $http({
        actionDescription: 'action_register_user_clerk',
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/registration/clerk',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'user_email': _pendingUserRegistration.user_email,
          'firstName': _pendingUserRegistration.firstName,
          'lastName': _pendingUserRegistration.lastName,
          'password': _pendingUserRegistration.password,
          'account_name': _pendingUserRegistration.account_name,
          'company_name': _pendingUserRegistration.company || null,
          'country_code': _pendingUserRegistration.country_code || null,
          'industry_code': _pendingUserRegistration.industry_code || null,
          'phone_number': _pendingUserRegistration.phone_number || null,
          'terms_and_conditions_version': _pendingUserRegistration.termsAndConditions,
          'origin': _pendingUserRegistration.origin || null,
          'clerk_user_id': clerkUserId
        }
      });
    }

    function _notifyUserRegistration(apiKey, clerkUserId) {
      console.log('_notifyUserRegistration apiKey', apiKey);
      return $http({
        actionDescription: 'action_notify_user_registration',
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/notify',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token ' + apiKey
        },
        data: {
          'user_email': _pendingUserRegistration.user_email,
          'firstName': _pendingUserRegistration.firstName,
          'lastName': _pendingUserRegistration.lastName,
          'password': _pendingUserRegistration.password,
          'account_name': _pendingUserRegistration.account_name,
          'company_name': _pendingUserRegistration.company || null,
          'country_code': _pendingUserRegistration.country_code || null,
          'industry_code': _pendingUserRegistration.industry_code || null,
          'phone_number': _pendingUserRegistration.phone_number || null,
          'terms_and_conditions_version': _pendingUserRegistration.termsAndConditions,
          'origin': _pendingUserRegistration.origin || null,
          'clerk_user_id': clerkUserId
        }
      });
    }

    function verifyOtp(otp, process) {
      if (process === 'login') {
        return _verifyOtpLogin(otp);
      } else if (process === 'signup') {
        return _verifyOtpSignUp(otp);
      }
      return $q.reject('Invalid process');
    }

    function _verifyOtpLogin(otp) {
      return _instance().then(function(clerk) {
        return clerk.client.signIn.attemptSecondFactor({
          strategy: 'totp',
          code: otp
        })
        .then(function(res) {
          if (res.status === 'complete') {
            return clerk.setActive({ session: res.createdSessionId }).then(function () {
              return clerk.session.getToken({ template: 'legacy-api' }).then(function (token) {
                return { verified: true, token: token };
              });
            });
          }
          return { verified: false };
        })
        .catch(function(err) {
           //TODO: add default case
           var result = { verified: false };
           if (err && err.clerkError && Array.isArray(err.errors) && err.errors.length > 0) {
             var first = err.errors[0];
             switch (first.code) {
               case 'form_code_incorrect':
                 result.codeIncorrect = true;
                 break;
               case 'verification_expired':
                 result.verificationExpired = true;
                 break;
             }
           }
           $rootScope.$applyAsync();
           return result;
        });
      })
    }

    function _verifyOtpSignUp(otp) {
      return _instance().then(function(clerk) {
        return clerk.client.signUp.attemptEmailAddressVerification({ 
          strategy: 'email_code', 
          code: otp 
        })
        .then(function(emailVerifiedResponse) {
          if (emailVerifiedResponse.status === 'complete') {
            return _registerUserInRelay(emailVerifiedResponse.createdUserId).then(function() {
              return clerk.setActive({ session: emailVerifiedResponse.createdSessionId }).then(function () {
                return clerk.session.getToken({ template: 'legacy-api' }).then(function (token) {
                  return _getApiKey(token).then(function(apiKeyResponse) {
                    return _notifyUserRegistration(apiKeyResponse.data.api_key, emailVerifiedResponse.createdUserId).then(function() {
                      return { verified: true, token: token };
                    });
                  });
                });
              });
            });
          }
          return { verified: false };
        })
        .catch(function(err) {
          //TODO: add default case
          var result = { verified: false };
          if (err && err.clerkError && Array.isArray(err.errors) && err.errors.length > 0) {
            var first = err.errors[0];
            switch (first.code) {
              case 'form_code_incorrect':
                result.codeIncorrect = true;
                break;
              case 'verification_expired':
                result.verificationExpired = true;
                break;
            }
          }
          $rootScope.$applyAsync();
          return result;
        });
      });
    }
    
    function resendOtp() {
      return _instance().then(function(clerk) {
        return clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
          .then(function() {
            return { sent: true };
          })
          .catch(function(err) {
            $rootScope.$applyAsync();
            return { sent: false };
          });
      });
    }

    function getToken(options) {
      options = options || { template: 'legacy-api', headers: { 'skipAuthorization': true } };
      return _instance()
      .then(function(clerk) {
        return clerk.session.getToken(options);
      })
      .catch(function(error) {
        return $q.reject('Failed to get Clerk token: ' + error);
      });
    }

    function logout() {
      return _instance()
      .then(function(clerk) {
        if (clerk.session && clerk.session.end) {
          return clerk.session.end();
        }
      })
      .catch(function(error) {
        return $q.reject('Failed to logout Clerk: ' + error);;
      });
    }

      function mountUserButton(target) {
      var component = (typeof target === 'string') ? document.querySelector(target) : target;

      if (!component) {
        return $q.reject('mountUserButton: target not found');
      }

      return _instance().then(function (clerk) {
          return clerk.mountUserButton(component, {
            showName: false,
            customMenuItems: [
              {
                label: $translate.instant('submenu_con_settings'),
                href: '#/settings/connection-settings',
                mountIcon: function(el) {
                  el.innerHTML = '' //'⚙️'
                },
                unmountIcon: function() {},
              },
              {
                label: $translate.instant('submenu_dom_manager'),
                href: '#/settings/domain-manager',
                mountIcon: function(el) {
                  el.innerHTML = '' //'🌐'
                },
                unmountIcon: function() {},
              },
              {
                label: $translate.instant('submenu_my_plan'),
                href: '#/settings/my-plan',
                mountIcon: function(el) {
                  el.innerHTML = '' //'📈'
                },
                unmountIcon: function() {},
              },
              {
                label: $translate.instant('submenu_my_billing_information'),
                href: '#/settings/my-billing-information',
                mountIcon: function(el) {
                  el.innerHTML = '' //'💳'
                },
                unmountIcon: function() {},
              },
              {
                label: $translate.instant('log_out'),
                onClick: function () {
                  if ($rootScope && typeof $rootScope.logOut === 'function') {
                    $rootScope.$applyAsync(function(){ $rootScope.logOut(); });
                  } else {
                    logout();
                  }
                },
                mountIcon: function(el) {
                  el.innerHTML = '' //'🚪'
                },
                unmountIcon: function() {},
              }
            ]
          });
      });
    }

    function isAuthenticated() {
      return _instance()
        .then(function (clerk) {
          try {
            if (!clerk.session) {
              return false;
            }
            
            if (clerk.session.status) {
              return clerk.session.status === 'active';
            }
            
            return true;
          } catch (e) {
            return false;
          }
        })
        .catch(function () {
          return false;
        });
    }
  }
})();
