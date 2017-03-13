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
        loadUserDomains();
        return $q.resolve();
      }

      vm.showDomainInputButton = function(){
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
        settings.getDomains()
        .then(function(data){
          vm.domains = data.domains;
          vm.domainDefault = data.defaultDomain;
        });
      }
    }
})();
