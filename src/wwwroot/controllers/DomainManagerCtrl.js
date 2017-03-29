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

      vm.showNewDomainInput = function(domain){
        vm.showDomainInput = true;
        document.getElementById("domain").focus();
      };

      vm.addDomain = function(form) {
        vm.addSubmitted = true;
        if (!form.$valid) {
          return;
        }
        settings.createOrEditDomain(form.domain.$modelValue, false)
        .then(function() {
          vm.showDomainInput = false;
          loadUserDomains();
        });
      }
      vm.activateDomain = function(domain) {
        settings.createOrEditDomain(domain.name , false)
        .then(function() {
          domain.disabled = false;
        });
      }

      vm.disableDomain = function(domain) {
        settings.createOrEditDomain(domain.name , true)
        .then(function() {
          domain.disabled = true;
        });
      }

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
        });
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
      }

      vm.isDefaultDomain = function(ele) {
        return vm.defaultDomain == ele.name;
      }
    }
})();
