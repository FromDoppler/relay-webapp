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
      vm.domainDefault = "relay.com";
      vm.regexDomain = "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$)";
      vm.domains = settings.getDomains();

      vm.addDomain = function (form) {
        vm.submitted = true;
        if (!form.$valid) {
          return;
        }
        console.log(form.domain.$modelValue);
        settings.addDomain(form.domain.$modelValue);
      }
    }

})();
