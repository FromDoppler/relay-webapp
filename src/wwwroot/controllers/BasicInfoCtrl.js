(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('BasicInfoCtrl', BasicInfoCtrl);

  BasicInfoCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope'
  ];

  function BasicInfoCtrl($scope, $location, $rootScope) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_basic_info', url: 'settings/basic-info', active: true },
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: false },
      { text: 'domains_text', url: 'settings/domain-manager', active: false }
    ]);
    vm.changePassword = changePassword;


    function changePassword(form) {
      vm.submitted = true;
      if (form.newPass.$modelValue != form.confPass.$modelValue || !form.$valid) {
        return;
      }

      auth.changePassword(form.oldPass.$modelValue, form.newPass.$modelValue)
      .then(function(data) {

      });
    }
  }

})();
