(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('DomainManagerCtrl', DomainManagerCtrl);

    DomainManagerCtrl.$inject = [
      '$scope',
      'settings',
      '$q'
    ];

    function DomainManagerCtrl($scope, settings, $q) {
      var vm = this;
      vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
      vm.activationPromise = activate();

      function activate() {
        return loadUserDomains();
      }

      vm.showNewDomainInput = function(){
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

      }

      function loadUserDomains() {
        return settings.getDomains()
        .then(function(data) {
          vm.domains = data.domains.map(function (ele) {
            return {
              status: ele.disabled ? 'disabled_text' : 'default_text',
              name: ele.name
             };
          });
          vm.domainDefault = data.defaultDomain;
        });
      }
    }
})();
