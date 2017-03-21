(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = [
    '$scope',
    '$rootScope',
    'RELAY_CONFIG'
  ];

  function SettingsCtrl($scope, $rootScope, RELAY_CONFIG) {
    $rootScope.setSubmenues([
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: true },
      { text: 'domains_text', url: 'settings/domain-manager', active: false }
    ]);
    var vm = this;
    vm.apiUrl = RELAY_CONFIG.baseUrl;
    vm.hostSmtp = RELAY_CONFIG.hostSmtp;
    vm.portSmtp = RELAY_CONFIG.portSmtp;
    ///TODO: The following code will be used when we allow the user to change their password. And this code is for toggling the input type.
    vm.inputType = 'password';
    vm.toggleShowPassword = function () {
      vm.inputType = vm.inputType != 'password' ? 'password' : 'text';
    }
  }
})();
