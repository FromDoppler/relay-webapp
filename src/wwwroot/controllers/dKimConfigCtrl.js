(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('dKimConfigCtrl', dKimConfigCtrl);

  dKimConfigCtrl.$inject = [
    '$scope',
    '$location',
    'settings',
    '$rootScope'
  ];

  function dKimConfigCtrl($scope, $location, settings, $rootScope) {
    $rootScope.setSubmenues([        
      { text: 'domains_text', url: 'settings/domain-manager', active: true },
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: false }
    ]);
    var vm = this;
    var queryParams = $location.search();
    vm.domain = queryParams['d'];
    vm.loading = true;
    vm.dKimStatus = null;
    vm.spfStatus = null; 
    vm.dKimPublicKey = null;
    vm.dKimSelector = null;
    vm.dmarcStatus = null; 
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
        vm.trackingDomainStatus = response.data.tracking_domain_ready;
        vm.trackingDomain = response.data.tracking_domain;
        vm.canoncalTrackingDomain = response.data.canonical_tracking_domain;
        vm.dmarcStatus = response.data.dmarc_ready; 
      });
  }
}
})();
