(function() {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('SucceedRegistrationCtrl', SucceedRegistrationCtrl);
  
      SucceedRegistrationCtrl.$inject = [
      'auth',
      '$translate',
      '$location',
      'vcRecaptchaService'
    ];
  
    function SucceedRegistrationCtrl(auth, $translate, $location, vcRecaptchaService) {
        var vm = this;
        var queryParams = $location.search();
        var email = queryParams['email'];
        if (!email) {
            $location.path('/');
        }
        vm.resendEmail = resendEmail;
        vm.resendFinished = false;
        vm.setResponse = setResponse;
        vm.setWidgetId = setWidgetId;
        vm.captchaExpiration = captchaExpiration;

        function setWidgetId (widgetId) {
            vm.widgetId = widgetId;
        };
        
        function captchaExpiration () {
            vcRecaptchaService.reload(vm.widgetId);
            vm.response = null;
        };

        function resendEmail() {
            vcRecaptchaService.reload(vm.widgetId);
            vcRecaptchaService.execute(vm.widgetId);
        }

        function setResponse (response) {
            auth.forgotPassword(email, $translate.use(), response)
            .then(function (result) {
                 vm.resendFinished = true;
            })
            .catch(function (result){
                 captchaExpiration();
            });
        }
        
    }
  
  })();
  