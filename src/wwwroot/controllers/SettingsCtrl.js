(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = [
    '$scope',
    '$rootScope',
    'RELAY_CONFIG',
    'settings'
  ];

  function SettingsCtrl($scope, $rootScope, RELAY_CONFIG, settings) {
    $rootScope.setSubmenues([
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: true },
      { text: 'domains_text', url: 'settings/domain-manager', active: false }
    ]);
    var vm = this;
    vm.loadInProgress = true;
    vm.apiUrl = RELAY_CONFIG.baseUrl;
    vm.hostSmtp = RELAY_CONFIG.hostSmtp;
    vm.portSmtp = RELAY_CONFIG.portSmtp;
    ///TODO: The following code will be used when we allow the user to change their password. And this code is for toggling the input type.
    vm.inputType = 'password';
    vm.toggleShowPassword = function () {
      vm.inputType = vm.inputType != 'password' ? 'password' : 'text';
    }

    vm.apiKey = '';
    settings.getUserApiKeys()
      .then(function (apiKeys) {
        // Show the first api key (in the future a user will be able to handle more than one)
        vm.apiKey = apiKeys[0].api_key;
      })
      .finally(function () {
        vm.loadInProgress = false;
      });;
  }
})();
