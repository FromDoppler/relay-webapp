(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('DomainManagerCtrl', DomainManagerCtrl);

    DomainManagerCtrl.$inject = [
      '$scope',
      'settings',
      '$q',
      '$rootScope',
      'utils',
      '$timeout'
    ];

    function DomainManagerCtrl($scope, settings, $q, $rootScope, utils, $timeout) {
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

      vm.showNewDomainInput = function(){
        vm.showDomainInput = true;
      };

      vm.addDomain = function(form) {
        vm.addSubmitted = true;
        if (!form.$valid) {
          return;
        }
        var newDomainName = vm.newDomainName;
        vm.showDomainInput = false;
        settings.createOrEditDomain(newDomainName, false)
        .then(function() {
          return loadUserDomains();
        })
        .then(function() {
          recentlyUpdated(newDomainName);
          utils.resetForm(vm, form);
          vm.addSubmitted = false;
        });
      }

      vm.activateDomain = function(domain) {
        settings.createOrEditDomain(domain.name, false)
        .then(function() {
          domain.disabled = false;
          recentlyUpdated(domain.name);
        });
      };

      vm.disableDomain = function(domain) {
        settings.createOrEditDomain(domain.name, true)
        .then(function() {
          domain.disabled = true;
          recentlyUpdated(domain.name);
        });
      };

      vm.deleteDomain = function(domain) {
        settings.deleteDomain(domain.name)
        .then(function() {
          var domainPos = vm.domains.indexOf(domain);
          if (domainPos >= 0) {
            vm.domains.splice(domainPos, 1);
          }
        });
      };

      vm.setDefaultDomain = function(domain) {
        settings.setDefaultDomain(domain)
        .then(function() {
          vm.defaultDomain = domain;
          recentlyUpdated(domain);
        });
      };

      function recentlyUpdated(domainName) {
       var domain = vm.domains.find(function(x) {
         return x.name == domainName;
       });
       if (domain) {
         domain.recentlyUpdated = true;
         $timeout(function(){
           domain.recentlyUpdated = false;
         }, 1000);
       }
     }

      function loadUserDomains() {
        return settings.getDomains()
        .then(function(response) {
          vm.defaultDomain = response.data.default;
          vm.domains = response.data.domains;
        });
      }

      vm.getDomainStatus = function(ele) {
        return vm.defaultDomain == ele.name ? 'default_text'
          : (ele.disabled ? 'disabled_text' : 'enable_text');
      };

      vm.isDefaultDomain = function(ele) {
        return vm.defaultDomain == ele.name;
      };
    }
})();
