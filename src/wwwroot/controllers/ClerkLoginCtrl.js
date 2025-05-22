(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ClerkLoginCtrl', ClerkLoginCtrl);

  ClerkLoginCtrl.$inject = [
    '$location',
    '$timeout',
    'clerkAuth',
    '$translate'
  ];

  function ClerkLoginCtrl($location, $timeout, clerkAuth, $translate) {
    var vm = this;
    vm.submitLogin = submitLogin;
    vm.isLoading = false;
    vm.error = null;

    // Initialize Clerk
    clerkAuth.initialize()
      .then(function() {
        console.log('Clerk initialized');
        if (clerkAuth.isAuthenticated()) {
          $location.path('/');
        }
      })
      .catch(function(error) {
        console.error('Error initializing Clerk:', error);
        vm.error = $translate.instant('login_error_initialization');
      });

    function submitLogin() {
      vm.isLoading = true;
      vm.error = null;

      clerkAuth.signIn()
        .then(function() {
          $location.path('/');
        })
        .catch(function(error) {
          console.error('Error signing in:', error);
          vm.error = $translate.instant('login_error_signin');
        })
        .finally(function() {
          vm.isLoading = false;
        });
    }
  }
})(); 