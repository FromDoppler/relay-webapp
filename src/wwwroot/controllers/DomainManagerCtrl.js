(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('DomainManagerCtrl', DomainManagerCtrl);

    DomainManagerCtrl.$inject = [
      '$scope',
      'settings',
      '$q',
      '$rootScope'
    ];

    function DomainManagerCtrl($scope, settings, $q, $rootScope) {
      $rootScope.setSubmenues([
        { text: 'submenu_smtp', url: 'settings/connection-settings', active: false },
        { text: 'domains_text', url: 'settings/domain-manager', active: true }
      ]);
      var vm = this;
      vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
      vm.activationPromise = activate();

      function activate() {
        return loadUserDomains();
      }

      //This code will be commented until we add the new Domain Functionality
      /*vm.showNewDomainInput = function(){
        vm.showDomainInput = true;
      };

      vm.addDomain = function(form) {
        vm.submitted = true;
        if (!form.$valid) {
          return;
        }
        settings.addDomain(form.domain.$modelValue)
        .then(function() {
          loadUserDomains();
        });

      }*/

      function loadUserDomains() {
        return settings.getDomains()
        .then(function(response) {
          vm.domains = response.data.domains.map(function (ele) {
            return {
              status: response.data.defaultDomain == ele.name ? 'default_text'
                : (ele.disabled ? 'disabled_text' : 'enable_text'),
              name: ele.name,
              disabled: ele.disabled,
              defaultDomain: response.data.defaultDomain == ele.name ? true : false
             };
          });
          vm.defaultDomain = response.data.defaultDomain;
        });
      }
    }
})();
