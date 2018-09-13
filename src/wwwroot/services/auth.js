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
      loginByToken: loginByToken,
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
      changeEmail: changeEmail,
      isUrlAllowed: isUrlAllowed,
      getDefaultUrl: getDefaultUrl
    };
    var loginSession = null;
    
    init();
    return authService;

    function init() {
      var encodedToken = $window.localStorage.getItem('jwtToken');
      if (encodedToken) {
        try {
          loginSession = decodeLoginSession(encodedToken);
          // To ensure having relayLogin item in legacy sessions
          $rootScope.forceMsEditor = loginSession.forceMsEditor || false;
          var storedSession = $window.localStorage.getItem('relayLogin');
          !storedSession && saveStoredSession(loginSession);
        } catch (error) {
          logOut();
          return;
        }
      }
    }

    // Save the token in the local storage (globally) or in a temporal variable (local)
    function loginByToken(jwtToken) {
      loginSession = decodeLoginSession(jwtToken);
      $rootScope.forceMsEditor = loginSession.forceMsEditor || false;
      saveStoredSession(loginSession);
    }

    function saveStoredSession(loginSession) {
      $window.localStorage.setItem('jwtToken', loginSession.token);
      $window.localStorage.setItem('relayLogin', angular.toJson({
        accountId: loginSession.accountId,
        accountName: loginSession.accountName
      }));
    }

    function decodeLoginSession(jwtToken) {
      var decodedToken = jwtHelper.decodeToken(jwtToken);
      var permissions = expandPermissions(decodedToken.profile);
      var accountName = decodedToken.relay_accounts && decodedToken.relay_accounts[0] || decodedToken.unique_name.replace("@", "-").replace(".com.ar", "").replace(".com", "");
      return {
        token: jwtToken,
        permissions: permissions,
        accountId: decodedToken.sub,
        accountName: accountName,
        accounts: decodedToken.relay_accounts,
        username: decodedToken.unique_name,
        expiration: decodedToken.exp,
        temporaryToken: decodedToken.relay_temporal_token,
        forceMsEditor: decodedToken.force_mseditor
      };
    }

    function expandPermissions(profile) {
      // TODO: Review why the revision numbers are being added into the word templates in this file.
      var TEMPLATES = " templates ".trim();
      switch (profile) {
        case "reports": return {
          acceptedUrlsPattern: /^#?\/reports\/?(\?.*)?$|^#?\/reports\/downloads\/?(\?.*)?$/,
          defaultUrl: "/reports"
        };
        case TEMPLATES: return {
          acceptedUrlsPattern: /^#?\/templates(\/.*)?$/,
          defaultUrl: "/templates"
        };
        case "settings": return {
          acceptedUrlsPattern: /^#?\/settings\//,
          defaultUrl: "/settings/connection-settings"
        };
        default: return null;
      }
    }

    function isUrlAllowed(url) {
      return !loginSession 
        || !loginSession.permissions
        || loginSession.permissions.acceptedUrlsPattern.test(url);
    }

    function getDefaultUrl() {
      return loginSession && loginSession.permissions && loginSession.permissions.defaultUrl || null;
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
        loginByToken(token);
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
      if (!loginSession) {
        return null;
      }
      if (loginSession.temporaryToken) {
        return loginSession.token
      }
      ensureToken();
      return loginSession && loginSession.token;
    }
    
    function ensureToken() {
      // It is to allow apply logout in all open tabs and also to avoid having different users in UI and AJAX requests.
      var storedToken = $window.localStorage.getItem('jwtToken');
      
      if (storedToken != loginSession.token) {
        try {
          loginByToken(storedToken);
        } catch (error) {
          logOut();
        }
      }
    }

    function logOut() {
      loginSession = null;
      $window.localStorage.removeItem('jwtToken');
      $window.localStorage.removeItem('relayLogin');
    }

    // Check if the user is authenticated
    function isAuthed() {
      return loginSession != null;
    }

    function isTemporarilyAuthed() {
      return loginSession && loginSession.temporaryToken || false;
    }

    function getAccountName() {
      return loginSession && loginSession.accountName;
    }

    function getAccountId() {
      return loginSession && loginSession.accountId;
    }

    function getUserName() {
      return loginSession && loginSession.username;
    }

    function getFullName() {
      return loginSession && (loginSession.name || getAccountName());
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
      if (!loginSession || loginSession.temporaryToken || !accountName) {
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
          trialEndDate: mapDate(response.data.trialEndDate),
          cancellationDate: mapDate(response.data.cancellationDate),
          requiresDomainConfiguration: !!response.data.domainConfigurationRequired,
          requiresDeliveries: !!response.data.hasNotDeliveries
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
        loginByToken(token);
      })
      .catch(function (reason) {
        return $q.reject(reason);
      });
    }
  }
})();
