(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('DomainManagerCtrl', DomainManagerCtrl);

    DomainManagerCtrl.$inject = [
      '$scope',
      'settings'
    ];

    function DomainManagerCtrl($scope, settings) {
      var vm = this;
      vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
      activate();

      function activate() {
        loadUserDomains();
      }

      vm.toggleDomainInput = function(){
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
