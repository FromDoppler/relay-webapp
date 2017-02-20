﻿(function () {
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
      getApiToken: getApiToken
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
      return $http({
        actionDescription: actionDescription,
        avoidStandarErrorHandling: true,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/tokens',
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
        return { authenticated: true };
      })
      .catch(function (reason) {
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
            $rootScope.addError('error_handler_unexpected_rejection', actionDescription, reason);
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

    function forgotPassword(email, lang) {
      return $http({
        actionDescription: 'action_recovering_password',
        method: 'PUT',
        url: RELAY_CONFIG.baseUrl + '/user/password/recover?lang=' + lang,
        headers: {
          'Content-Type': 'application/json'
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
  }
})();
