(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('LoginCtrl', LoginCtrl);
  LoginCtrl.$inject = [
    '$location',
    '$timeout',
    'auth',
    '$translate',
    'vcRecaptchaService'
  ];

  function LoginCtrl($location, $timeout, auth, $translate, vcRecaptchaService) {

    var vm = this;
    vm.forgotOpened = false;
    vm.forgotSuccessful = false;
    vm.updateValidation = updateValidation;
    vm.gotoBottom = gotoBottom;
    vm.submitLogin = submitLogin;
    vm.removeSucceed = removeSucceed;
    vm.submitForgot = submitForgot;
    vm.setCaptchaResponse = setCaptchaResponse;
    vm.setWidgetId = setWidgetId;
    vm.reloadCaptcha = reloadCaptcha;
    vm.hideForgotButton = false;

    function updateValidation(loginform) {
      if (loginform && loginform.email.$modelValue) {
        loginform.email.$setValidity('error', true);
      }
      if (loginform && loginform.password.$modelValue) {
        loginform.password.$setValidity('error', true);
      }
    }
    function gotoBottom() {
      vm.forgotOpened = !vm.forgotOpened;
    };

    function submitLogin (loginform) {
      if (loginform.$invalid) {
        return;
      }

      var credentials = {
        username: vm.email,
        password: vm.password
      };

      auth.login(credentials).then(function (result) {
        if (result.authenticated) {
          $location.path('/');
        } else {
          loginform.email.$setValidity('error', false);
          loginform.password.$setValidity('error', false);
        }
      });
    };

    function removeSucceed() {
      if (vm.forgotSuccessful) {
        vm.forgotSuccessful = false;
      }
    }

    function setWidgetId (widgetId) {
      vm.widgetId = widgetId;
    };

    function submitForgot(forgotForm) {
      if (forgotForm.$invalid) {
        return;
      }
      vm.hideForgotButton = true;
      vcRecaptchaService.execute(vm.widgetId);
    };
    
    function setCaptchaResponse (response) {
      if(!response){
        reloadCaptcha();
        return;
      }
      auth.forgotPassword(vm.forgotEmail, $translate.use(), response)
      .then(function () {
        vm.forgotSuccessful = true;
      }).finally(function (){
        vm.hideForgotButton = false;
        reloadCaptcha();
      });
    }

    function reloadCaptcha () {
      vcRecaptchaService.reload(vm.widgetId);
      vm.response = null;
    };

  }
})();
