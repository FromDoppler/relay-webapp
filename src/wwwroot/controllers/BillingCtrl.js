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
    'settings'
  ];

  function BillingCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);

  }

})();
