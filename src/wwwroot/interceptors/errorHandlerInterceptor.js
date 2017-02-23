'use strict';

angular.module('dopplerRelay')
  .factory('errorHandlerInterceptor', ['$q', '$location', '$injector', '$window', '$rootScope', function ($q, $location, $injector, $window, $rootScope) {
    var responseError = function (rejection, cause) {
      var config = rejection.config || {};
      if ((!config.tryHandleError || !config.tryHandleError(rejection)) && !config.avoidStandarErrorHandling) {
        var actionDescription = !config.actionDescription ? '' : config.actionDescription;
        var rejectionTitle = !rejection.data ? null : rejection.data.title;
        switch (rejection.status) {
          case 401: //Unauthorized by token expired
            if (rejection.data.errorCode == 3) {
              $rootScope.addAuthorizationError('error_handler_401.3', null, null, $rootScope.logOut);
            } else {
              $rootScope.addAuthorizationError('error_handler_401/3', rejection.status, rejection.data.errorCode, $rootScope.logOut);
            }
            break;
          case 403: //Forbidden and Unauthorized
            // TODO: The problem could be different than expired token, so maybe it is better to show a more ambiguous message
            // For example: open a new windows and login with a different user, and try to do something in the first window
            $rootScope.addAuthorizationError('error_handler_401/3', rejection.status, rejection.data.errorCode, $rootScope.logOut);
            break;
          case 404: //Not Found
            $rootScope.addError('error_handler_404', actionDescription, rejectionTitle);
            break;
          case 429: //Too Many Requests
            $rootScope.addError('error_handler_429', actionDescription, rejectionTitle);
            break;
          default:
            if (rejection.data && rejection.data.title) {
              $rootScope.addError('error_handler_unexpected_rejection', actionDescription, rejectionTitle);
            } else {
              $rootScope.addError('error_handler_unexpected', actionDescription);
            }
            break;
        }
      }
      return $q.reject(rejection);
    };

    return {
      responseError: responseError
    };
  }]);
