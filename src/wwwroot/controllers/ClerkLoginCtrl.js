(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ClerkLoginCtrl', ClerkLoginCtrl);

  ClerkLoginCtrl.$inject = [
    '$location',
    'clerkAuth',
    '$translate',
    '$scope',
    '$rootScope'
  ];

  function ClerkLoginCtrl($location, clerkAuth, $translate, $scope, $rootScope) {
    var vm = this;
    vm.submitLogin = submitLogin;
    vm.isLoading = false;
    vm.error = null;
    
    function submitLogin() {
      vm.isLoading = true;
      vm.error = null;

      clerkAuth.openSignIn()
      .catch(function(error) {
        vm.error = 'error_clerk_signin';
        $translate(vm.error).then(function(translation) {
          vm.error = translation;
        });
      })
      .finally(function() {
        vm.isLoading = false;
      });
    }
  }
})();
