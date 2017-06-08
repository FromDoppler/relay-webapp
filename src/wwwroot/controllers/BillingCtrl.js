(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('BillingCtrl', BillingCtrl);

  BillingCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings',
    'utils'
  ];

  function BillingCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, utils) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);
    vm.checkExpDate = checkExpDate;

    function checkExpDate(input) {
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear().toString().slice(2);
      var currentMonth = currentDate.getMonth() + 1;
      console.log(input);
      if (input.$modelValue) {
        var year = input.$modelValue.slice(2);
        var month = input.$modelValue.slice(0,2);
      }

      if (year < currentYear || month > 12) {
        utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
      }
      if (year == currentYear && month < currentMonth) {
        utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
      }
    }




  }

})();
