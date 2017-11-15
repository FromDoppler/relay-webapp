(function() {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('SucceedRegistrationCtrl', SucceedRegistrationCtrl);
  
      SucceedRegistrationCtrl.$inject = [
      'auth',
      '$translate',
      '$location'
    ];
  
    function SucceedRegistrationCtrl(auth, $translate, $location) {
        var vm = this;
        var queryParams = $location.search();
        var email = queryParams['email'];
        if (!email) {
            $location.path('/');
        }
        vm.resendEmail = resendEmail;
        vm.resendFinished = false;

        function resendEmail() {
            auth.forgotPassword(email, $translate.use())
            .then(function (result) {
                vm.resendFinished = true;
            });
        }
    }
  
  })();
  