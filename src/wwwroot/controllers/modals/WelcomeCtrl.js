(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('WelcomeCtrl', WelcomeCtrl);

  WelcomeCtrl.$inject = [
    'close',
    'auth',
    '$location'
  ];

  function WelcomeCtrl(close, auth, $location) {
    var vm = this;
    vm.name = auth.getAccountName();
    vm.goToDomainManager = function() {
      $location.path('settings/domain-manager');
    };
  }
})();
