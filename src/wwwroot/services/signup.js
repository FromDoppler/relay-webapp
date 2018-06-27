(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('signup', signup);

  signup.$inject = [
    '$http',
    '$window',
    '$q',
    'auth',
    'RELAY_CONFIG',
    '$rootScope'
  ];


  function signup($http, $window, $q, auth, RELAY_CONFIG, $rootScope) {

    var signupService = {
      getUser: getUser,
      getApiKey: getApiKey,
      activateUser: activateUser,
      registerUser: registerUser
    };

    return signupService;

    function getUser(apiKey) {
      var actionDescription = 'action_get_user';
      return $http({
        actionDescription: actionDescription,
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/user',
        avoidStandarErrorHandling: true,
        skipAuthorization: true,
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'token ' + apiKey
        }
      })
      .then(function (response) {
        return response;
      })
      .catch(function (reason) {
        var data = reason.data || { };
        if (reason.status == 401) {
          return { getUserError: true, detail: data.detail };
        }
        else {
          var actionDescription = reason.config && reason.config.actionDescription || '';
          var actionTitle = data.title || '';
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

    function getApiKey(temporalApiKey) {
      var actionDescription = 'action_get_temp_api_key';
      return $http({
        actionDescription: actionDescription,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/apikeys',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'token ' + temporalApiKey
        }
      })
      .then(function (response) {
        return response;
      })
      .catch(function (reason) {
        var data = reason.data || { };
        if (reason.status == 401) {
          return { getApiKeyError: true, detail: data.detail };
        }
        else {
          var actionDescription = reason.config && reason.config.actionDescription || '';
          var actionTitle = data.title || '';
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

    function activateUser(apiKey, domain, email, pass, language, industry, phoneNumber, country, termsAndConditions) {
      var actionDescription = 'action_activating_user';
      return $http({
        actionDescription: actionDescription,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/reset?lang=' + language,
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'token ' + apiKey
        },
        data: {
          "domain": domain,
          "password": pass,
          "industry_code": industry,
          "phone_number": phoneNumber,
          "country_code": country,
          "terms_and_conditions_version": termsAndConditions
        }
      });
    }

    function registerUser(newUser, language, onExpectedError) {
      var actionDescription = 'action_register_user';
      var tryHandleError = function (rejection) {
        if (rejection.status != 400 || !rejection.data || rejection.data.errorCode != 3) {
          return false; // not handled
        }
        return onExpectedError(rejection.data)
      };

      return $http({
        actionDescription: actionDescription,
        tryHandleError: tryHandleError,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user/registration?lang=' + language,
        headers: {
          'Content-Type': 'application/json',
          'g-recaptcha-response': newUser.recaptchaResponse
        },
        data: {
          'user_email': newUser.user_email,
          'firstName': newUser.firstName,
          'lastName': newUser.lastName,
          'password': newUser.password || null,
          'account_name': newUser.account_name,
          'company_name': newUser.company || null,
          'terms_and_conditions_version': newUser.termsAndConditions,
          'origin': newUser.origin || null,
          'promotions_consent': newUser.checkPromotions
        }
      });
    }
  }
})();
