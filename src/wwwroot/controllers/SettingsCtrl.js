(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = [
    '$scope',
    '$rootScope',
    'RELAY_CONFIG',
    'settings',
    '$translate',
    'ModalService'
  ];

  function SettingsCtrl($scope, $rootScope, RELAY_CONFIG, settings, $translate, ModalService) {
    $rootScope.setSubmenues([
      { text: 'domains_text', url: 'settings/domain-manager', active: false },
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: true }      
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
    
    vm.apiKeySentSuccefully = false;
    vm.apiKeySentFailed = false;

    vm.requestApiKey = function () {
      vm.loadInProgress = true;
      vm.apiKeySentSuccefully = false;
      vm.apiKeySentFailed = false;
      settings.requestUserApiKey($translate.use())
      .then(function () {
        vm.apiKeySentSuccefully = true;
        vm.apiKeySentFailed = false;
      })
      .catch(function () {
        vm.apiKeySentSuccefully = false;
        vm.apiKeySentFailed = true;
      })
      .finally(function () {
        vm.loadInProgress = false;
      });
    }

    vm.resetApiKey = function() {
      ModalService.showModal({
        templateUrl: 'partials/modals/confirm.html',
        controller: 'Confirm',
        controllerAs: 'vm',
        inputs: {
          title: "connection-settings_reset_api_key_popup_title",
          mainText: "connection-settings_reset_api_key_popup_desc",
          actionSuccess: requestResetApiKey,
          cancelButtonText: "cancel_text",
          buttonText: "confirm_text"
        }
      })
      .then(function (modal) {
        modal.close.then();
      });
    }

    function requestResetApiKey() {
      vm.loadInProgress = true;
      vm.apiKeySentSuccefully = false;
      vm.apiKeySentFailed = false;
      settings.resetUserApiKey($translate.use())
      .then(function () {
        vm.apiKeySentSuccefully = true;
        vm.apiKeySentFailed = false;
      })
      .catch(function () {
        vm.apiKeySentSuccefully = false;
        vm.apiKeySentFailed = true;
      })
      .finally(function () {
        vm.loadInProgress = false;
      });
    }
    vm.loadInProgress = false;
  }
})();
