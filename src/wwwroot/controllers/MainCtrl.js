(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = [
    '$rootScope',
    '$scope',
    '$window',
    '$location',
    'auth',
    '$log',
    'ModalService',
    '$route'
  ];

  function MainCtrl($rootScope, $scope, $window, $location, auth, $log, ModalService, $route) {
    $rootScope.getLoggedUserEmail = function () {
      return auth.getUserName();
    };

    $rootScope.getTermsAndConditionsVersion = function () {
      return 1;
    };

    $rootScope.getAccountName = auth.getAccountName;
    $rootScope.getFullName = auth.getFullName;
    $rootScope.getAccountId = auth.getAccountId;

    $rootScope.addError = function (error, actionDescription, rejectionTitle, statusCode, errorCode, callback, buttonText) {
      callback = callback || $route.reload;
      ModalService.showModal({
        templateUrl: 'partials/modals/error.html',
        controller: 'ErrorCtrl',
        controllerAs: 'vm',
        inputs: {
          description: error,
          actionDescription: actionDescription,
          rejectionTitle: rejectionTitle || '',
          statusCode: statusCode,
          errorCode: errorCode,
          isAuthorizationModal: false,
          buttonText: buttonText || 'error_popup_button'
        }
      }).then(function (modal) {
        modal.close.then(callback);
      });
    };

    $rootScope.addAuthorizationError = function (error, statusCode, errorCode, callback) {
      ModalService.showModal({
        templateUrl: 'partials/modals/error.html',
        controller: 'ErrorCtrl',
        controllerAs: 'vm',
        inputs: {
          description: error,
          actionDescription: null,
          rejectionTitle: null,
          statusCode: statusCode,
          errorCode: errorCode,
          isAuthorizationModal: true
        }
      }).then(function (modal) {
        modal.close.then(callback);
      });
    };

    $rootScope.logOut = function () {
      auth.logOut();
      $location.path('/login');
    };

    var submenues = [];
    $rootScope.getSubmenues = function () {
      return submenues;
    };
    $rootScope.setSubmenues = function (newItems) {
      submenues = newItems;
    };
    $rootScope.isSubmenuVisible = function () {
      return submenues.length > 0;
    };
    $rootScope.$on('$locationChangeStart', function () {
      submenues = [];
    });

    $scope.isSubmenuVisible = $rootScope.isSubmenuVisible;

    $scope.isPermanentAuthed = function () {
      return auth.isAuthed() && !auth.isTemporarilyAuthed();
    };
  }

})();
