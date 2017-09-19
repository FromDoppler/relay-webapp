(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('HeaderCtrl', HeaderCtrl);
  HeaderCtrl.$inject = [
    '$scope',
    '$translate',
    '$location',
    '$rootScope'
  ];

  function HeaderCtrl($scope, $translate, $location, $rootScope) {
    $scope.changeLanguage = function (key) {
      $translate.use(key);
    };
    $scope.arrowUp = false;
    $scope.toggleConfigDropDown = function () {
      $scope.arrowUp = !$scope.arrowUp;
    };
    $scope.hideConfigDropDown = function () {
      if ($scope.arrowUp) {
        $scope.arrowUp = !$scope.arrowUp;
      }
    };
    $scope.getSubmenues = $rootScope.getSubmenues;
    $scope.isSubmenuVisible = $rootScope.isSubmenuVisible;

    UpdateTrialHeader();
    
    function UpdateTrialHeader() {
      $scope.isFreeTrialEnded = false;
      $scope.isFreeTrialAlmostEnded = false;
      $scope.isFreeTrial = false;
      return $rootScope.freeTrialEndDate().then(function(freeTrialEndDate) {
        var todayDate = moment().toDate();
        var daysLeft = moment(freeTrialEndDate).diff(todayDate, "days");
        $scope.isFreeTrial = freeTrialEndDate ? true : false;
        $scope.trialDaysLeft = daysLeft;
        if (freeTrialEndDate <= todayDate) {
          $scope.isFreeTrialEnded = true;
          $scope.isFreeTrialAlmostEnded = false;
          $scope.showFreeTrialHeader = false;
        }
        if (daysLeft <= 10 && daysLeft >= 0 && freeTrialEndDate > todayDate) {
          $scope.isFreeTrialAlmostEnded = true;
          $scope.isFreeTrialEnded = false;
          $scope.showFreeTrialHeader = false;
        }

        if (freeTrialEndDate && !$scope.isFreeTrialEnded && !$scope.isFreeTrialAlmostEnded) {
          $scope.showFreeTrialHeader = true;
          $scope.isFreeTrialEnded = false;
          $scope.isFreeTrialAlmostEnded = false;
        }
      });
    }
    
    

    
    $scope.initialsAvatar = function () {
      var fullName = $rootScope.getFullName();
      if (!fullName) {
        return "?";
      }
      var match = fullName.match(/\b(\s)/g);
      if (!match) {
        return fullName.charAt(0);
      }
      return match.join('');
    }
  }
})();

