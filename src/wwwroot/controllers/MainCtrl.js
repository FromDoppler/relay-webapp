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
    '$route',
    '$interval',
    '$translate',
    'utils'
  ];

  function MainCtrl($rootScope, $scope, $window, $location, auth, $log, ModalService, $route, $interval, $translate, utils) {
     
    var key = utils.getPreferredLanguage();
    $translate.use(key);

    $rootScope.changeLanguage = function (key) {
      $translate.use(key);
      utils.setPreferredLanguage(key);
    };

    $rootScope.getLoggedUserEmail = function () {
      return auth.getUserName();
    };

    $rootScope.getTermsAndConditionsVersion = function () {
      return 1;
    };
     
    var freeTrialNotification = auth.getFreeTrialNotificationFromStorage();
    var modalOpened = false;
    
    $rootScope.freeTrialStatus = null;
    $rootScope.accountLimits = { };
    $rootScope.requiresDkimConfiguration = false;

    $rootScope.loadLimits = loadLimits;
    
    $interval(loadLimits, 30000);

    loadLimits();

  function loadLimits() {
    auth.getLimitsByAccount()
      .then(updateLimitsAndTrialData)
      .catch($log.error);
  }

  function updateLimitsAndTrialData(limits) {
    $rootScope.accountLimits = limits;
    $rootScope.requiresDkimConfiguration = limits.requiresDkimConfiguration;
    var freeTrialEndDate = limits.endDate;
    if (!freeTrialEndDate) {
      $rootScope.freeTrialStatus = null;
      return;
    }
    var todayDate = moment().toDate();
    var daysLeft = moment(freeTrialEndDate).diff(todayDate, "days");

    $rootScope.freeTrialStatus = {
      trialDaysLeft : daysLeft,
      isFreeTrialEnded : false,
      isFreeTrialAlmostEnded : false,
      isFreeTrialEndToday : false
    }

    if (freeTrialEndDate <= todayDate) {
      $rootScope.freeTrialStatus = {
        trialDaysLeft : daysLeft,
        isFreeTrialEnded : true,
        isFreeTrialAlmostEnded : false,
        isFreeTrialEndToday : false
      }

      if (!modalOpened) {        
        if(!freeTrialNotification || freeTrialNotification <= freeTrialEndDate) {
          modalOpened = true;
          ModalService.showModal({
            templateUrl: 'partials/modals/general-template.html',
            controller: 'GeneralTemplateCtrl',
            controllerAs: 'vm',
            inputs: {
              title: "free_trial_ended_popup_title",
              mainText: "free_trial_ended_popup_subtitle",
              buttonText: "free_trial_ended_popup_button_text",
              action: function() {
                $location.path('/settings/my-plan');
              }
            }
          }).then(function (modal) {
            modal.close.then(function() {
              modalOpened = false;
            });
          });

          // Store it as soon it is shown
          auth.addFreeTrialNotificationToStorage(todayDate);
          freeTrialNotification = todayDate;
        }
      }
    }
    if (daysLeft <= 10 && daysLeft > 0) {
      $rootScope.freeTrialStatus = {
        trialDaysLeft : daysLeft,
        isFreeTrialEnded : false,
        isFreeTrialAlmostEnded : true,
        isFreeTrialEndToday : false
      }
    }
    if (daysLeft == 0) {
      $rootScope.freeTrialStatus = {
        trialDaysLeft : daysLeft,
        isFreeTrialEnded : false,
        isFreeTrialAlmostEnded : false,
        isFreeTrialEndToday : true
      }
    }
}

    $rootScope.getAccountName = auth.getAccountName;
    $rootScope.getFullName = auth.getFullName;
    $rootScope.getAccountId = auth.getAccountId;

    var addErrorInternal = function(inputs, callback) {
      return ModalService.showModal({
        templateUrl: 'partials/modals/error.html',
        controller: 'ErrorCtrl',
        controllerAs: 'vm',
        inputs: inputs
      }).then(function (modal) {
        modal.close.then(function (result) {
          if (result) {
            (callback || $route.reload)();
          }
        });
      });
    }

    $rootScope.addError = function (error, actionDescription, rejectionTitle, statusCode, errorCode, callback, buttonText) {
      var inputs = {
        description: error || null,
        actionDescription: actionDescription || null,
        rejectionTitle: rejectionTitle || '',
        statusCode: statusCode || null,
        errorCode: errorCode || null,
        isAuthorizationModal: false,
        buttonText: buttonText || 'error_popup_button'
      };
      return addErrorInternal(inputs, callback);
    };

    $rootScope.addAuthorizationError = function (error, statusCode, errorCode) {
      var inputs = {
        description: error || null,
        actionDescription: null,
        rejectionTitle: null,
        statusCode: statusCode || null,
        errorCode: errorCode || null,
        isAuthorizationModal: true,
        buttonText: 'error_popup_button_401/3'
      };
      return addErrorInternal(inputs, $rootScope.logOut);
    };

    $rootScope.logOut = function () {
      auth.logOut();
      loadLimits();
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
