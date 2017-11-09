(function() {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('SucceedRegistrationCtrl', SucceedRegistrationCtrl);
  
      SucceedRegistrationCtrl.$inject = [
      'utils'
    ];
  
    function SucceedRegistrationCtrl(utils) {
        var vm = this;
        vm.getCurrentLanguage = getCurrentLanguage;

        function getCurrentLanguage() {
            return utils.getPreferredLanguage();
        }
    }
  
  })();
  