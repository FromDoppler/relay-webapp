(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('WelcomeCtrl', WelcomeCtrl);

  WelcomeCtrl.$inject = [
    'close',
    'auth'
  ];

  function WelcomeCtrl(close, auth) {
    var vm = this;
    vm.name = auth.getAccountName();
    vm.closeModal = function() {
      close();
    };
  }
})();
