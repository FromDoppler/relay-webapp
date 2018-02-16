(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('auth', auth);

  auth.$inject = [
    '$http',
    '$window',
    '$q',
    'jwtHelper',
    'RELAY_CONFIG',
    '$rootScope'
  ];
  function auth($http, $window, $q, jwtHelper, RELAY_CONFIG, $rootScope) {

    var authService = {
      saveToken: saveToken,
      login: login,
      logOut: logOut,
      isAuthed: isAuthed,
      isTemporarilyAuthed: isTemporarilyAuthed,
      getAccountName: getAccountName,
      // deprecated
      getAccountId: getAccountId,
      getUserName: getUserName,
      getFullName: getFullName,
      forgotPassword: forgotPassword,
      resetPassword: resetPassword,
      getApiToken: getApiToken,
      changePassword: changePassword,  
      getLimitsByAccount: getLimitsByAccount,
      getFreeTrialNotificationFromStorage: getFreeTrialNotificationFromStorage,
      addFreeTrialNotificationToStorage: addFreeTrialNotificationToStorage,
      changeEmail: changeEmail
    };

    var decodedToken = null;
    var encodedToken = null;
    var temporarilyAuthed = false;

    encodedToken = $window.localStorage.getItem('jwtToken');
    if (encodedToken) {
      decodedToken = jwtHelper.decodeToken(encodedToken);
      // verify expiration
    }
    return authService;

    // Save the token in the local storage (globally) or in a temporal variable (local)
    function saveToken(token, isTemporal) {
      decodedToken = jwtHelper.decodeToken(token);
      encodedToken = token;
      temporarilyAuthed = !!isTemporal;
      if (!temporarilyAuthed) {
        $window.localStorage.setItem('jwtToken', token);
      }
    }

    // Login - Make a request to the api for authenticating
    function login(credentials) {
      var actionDescription = 'action_login';
      var url = RELAY_CONFIG.baseUrl;
      if (!credentials.userToImpersonate) {
        url = url + '/tokens';
      } else {
        url = url + '/tokens/impersonate';
      }
      return $http({
        actionDescription: actionDescription,
        avoidStandarErrorHandling: true,
        method: 'POST',
        url: url,
        skipAuthorization: true,
        headers: {
          'Content-Type': 'text/plain'
        },
        data: credentials
      })
      .then(function (response) {
        var token = response.data && response.data.access_token;
        if (!token) {
          return $q.reject({
            config: { actionDescription: actionDescription },
            data: { title: "Response does not include access token." }
          });
        }
        if (response.data.pending_activation) {
          return $q.reject({
            config: { actionDescription: actionDescription },
            data: { title: "User is pending activation." }
          });
        }
        saveToken(token);
        $rootScope.loadLimits();
        return { authenticated: true };
      })
      .catch(function (reason) {
        if(reason.status == 404 && reason.data.errorCode == 1) {
          return { clientAccountNotFound: true };
        }
        if(reason.status == 403 && reason.data.errorCode == 9) {
          return { accountNotAllowedToImpersonate: true };
        }
        if (reason.status == 401 && reason.data.errorCode == 2) {
          return { authenticated: false };
        }
        else {
          var actionDescription = !reason.config.actionDescription ? '' : reason.config.actionDescription;
          var actionTitle = reason.data && reason.data.title || '';
          if (actionTitle == '') {
            $rootScope.addError('error_handler_unexpected', actionDescription, reason);
          }
          else {
            $rootScope.addError('error_handler_unexpected_rejection', actionDescription, actionTitle);
          }
          return $q.reject(reason);
        }
      });
    }

    function getApiToken() {
      if (temporarilyAuthed) {
        return encodedToken;
      } else {
        ensureToken();
        return encodedToken;
      }
    }

    function ensureToken() {
      // It is to avoid have different users in UI and AJAX requests
      // TODO: improve it because when token is removed, the request is done anyway, maybe it is possible to cancel request when there is no token
      var token = $window.localStorage.getItem('jwtToken');
      if (!token) {
        logOut();
      } else if (token != encodedToken) {
        encodedToken = token;
        decodedToken = jwtHelper.decodeToken(encodedToken);
      }
    }

    function logOut() {
      decodedToken = null;
      encodedToken = null;
      temporarilyAuthed = false;
      $window.localStorage.removeItem('jwtToken');
    }

    // Check if the user is authenticated
    function isAuthed() {
      return decodedToken != null;
    }

    function isTemporarilyAuthed() {
      return temporarilyAuthed;
    }

    function getAccountName() {
      if (!decodedToken) {
        return null;
      }
      var accountName = decodedToken.relay_accounts && decodedToken.relay_accounts[0];
      if (!accountName) {
        accountName = decodedToken.unique_name.replace("@", "-").replace(".com.ar", "").replace(".com", "");
      }
      return accountName;
    }

    function getAccountId() {
      if (!decodedToken) {
        return null;
      }
      return decodedToken.sub;
    }

    function getUserName() {
      if (!decodedToken) {
        return null;
      }
      return decodedToken.unique_name;
    }

    function getFullName() {
      if (!decodedToken) {
        return null;
      }
      return decodedToken.name || getAccountName();
    }

    function forgotPassword(email, lang, captchaResponse) {
      return $http({
        actionDescription: 'action_recovering_password',
        method: 'PUT',
        url: RELAY_CONFIG.baseUrl + '/user/password/recover?lang=' + lang,
        headers: {
          'Content-Type': 'application/json',
          'g-recaptcha-response': captchaResponse
        },
        data: {
          'user_email': email
        }
      });
    }

    function resetPassword(pass, lang) {
      return $http({
        actionDescription: 'action_updating_password',
        method: 'PUT',
        url: RELAY_CONFIG.baseUrl + '/user/password?lang=' + lang,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "password": pass
        }
      });
    }
    function changePassword(old_pass, newPass, lang) {
      return $http({
        actionDescription: 'action_updating_password',
        method: 'PUT',
        avoidStandarErrorHandling: true,
        url: RELAY_CONFIG.baseUrl + '/user/password/change?lang=' + lang,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "username": getUserName(),
          "old_password": old_pass,
          "password": newPass
        }
      });
    }

    function getLimitsByAccount() {
      var accountName = getAccountName();
      if (!decodedToken || decodedToken.relay_temporal_token || !accountName) {
        // limits have no sense in these scenarios
        return $q.when({});
      }

      return $http({
        actionDescription: 'Gathering account limits',
        avoidStandarErrorHandling: true,
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountName  + '/status/limits'
      })
      .then(function (response) {
        return {
          monthly: mapLimit(response.data.monthly),
          daily: mapLimit(response.data.daily),
          hourly: mapLimit(response.data.hourly),
          hasLimits: !response.data.noLimits,
          endDate: mapDate(response.data.endDate),
          requiresDomainConfiguration: !!response.data.domainConfigurationRequired
        };
      });
    }

    function mapLimit(responseLimit)
    {
      if (!responseLimit) {
        return null;
      }

      return {
        limit: responseLimit.limit,
        remaining: responseLimit.remaining,
        reset: mapDate(responseLimit.reset)
      }
    }

    function mapDate(responseDate)
    {
      if (!responseDate) {
        return null;
      }

      return new Date(responseDate);
    }

    function addFreeTrialNotificationToStorage(date) {
      $window.localStorage.setItem('freeTrialNotificationOn', date.toISOString());
    }

    function getFreeTrialNotificationFromStorage() {
      return mapDate($window.localStorage.getItem('freeTrialNotificationOn'));
    }

    function changeEmail(lang) {
      var url = RELAY_CONFIG.baseUrl
        + '/user/email'
        + '?lang='+ lang;

      var actionDescription = 'action_changing_email';

      return $http({
        actionDescription: actionDescription,
        method: 'PUT',
        avoidStandarErrorHandling: true,
        url: url
      }).then(function (response) {
        var token = response.data && response.data.access_token;
        if (!token) {
          return $q.reject({
            config: { actionDescription: actionDescription },
            data: { title: "Response does not include access token." }
          });
        }
        saveToken(token);
      })
      .catch(function (reason) {
        return $q.reject(reason);
      });
    }
  }
})();
