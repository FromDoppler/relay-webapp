(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('dKimConfigCtrl', dKimConfigCtrl);

  dKimConfigCtrl.$inject = [
    '$scope',
    '$location',
    'settings'
  ];

  function dKimConfigCtrl($scope, $location, settings) {
    var vm = this;
    var queryParams = $location.search();
    vm.domain = queryParams['d'];
    vm.loading = true;
    vm.dKimStatus = null;
    vm.spfStatus = null; 
    vm.dKimPublicKey = null;
    vm.dKimSelector = null;
	vm.activationPromise = activate();

  function activate() {
    return loadDataDomain();
  }

  function loadDataDomain() {
    return settings.getDomain(vm.domain)
      .then(function(response) {
        vm.loading = false;
        vm.dKimStatus = response.data.dkim_ready;
        vm.spfStatus = response.data.spf_ready; 
        vm.dKimPublicKey = 'k=rsa; p=' + response.data.dkim_public_key;
        vm.dKimSelector = response.data.dkim_selector + '._domainkey.' + vm.domain;
      });
  }
}
})();
