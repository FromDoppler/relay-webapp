(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('dKimConfigCtrl', dKimConfigCtrl);

  dKimConfigCtrl.$inject = [
    '$scope',
    '$location'
  ];

  function dKimConfigCtrl($scope, $location) {
    var vm = this;
    var queryParams = $location.search();
    vm.domain = queryParams['d'];
    vm.dKimSelector = queryParams['sel'] + '._domainkey.' + vm.domain;
    vm.dKimPublicKey = 'k=rsa; p=' + + queryParams['key'];
  }

})();
