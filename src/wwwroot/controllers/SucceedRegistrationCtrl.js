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
        vm.resent = false;
        vm.setCaptchaResponse = setCaptchaResponse;
        vm.setWidgetId = setWidgetId;
        vm.reloadCaptcha = reloadCaptcha;

        function setWidgetId (widgetId) {
            vm.widgetId = widgetId;
        };        

        function resendEmail() {
            vcRecaptchaService.execute(vm.widgetId);
        }

        function setCaptchaResponse (response) {
            if(!response){
                reloadCaptcha();
                return;
            }
            vm.resent = true;
            auth.forgotPassword(email, $translate.use(), response)
            .catch(function (result){
                 vm.resent = false;
            }).finally(function (){
                reloadCaptcha();
           });
        }

        function reloadCaptcha () {
            vcRecaptchaService.reload(vm.widgetId);
            vm.response = null;
        };
    }
  
  })();
  