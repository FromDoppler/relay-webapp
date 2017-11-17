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

    function updateValidation(loginform) {
      if (loginform && loginform.email) {
        loginform.email.$setValidity('error', true);
      }
      if (loginform && loginform.password) {
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
        username: loginform.email.$modelValue,
        password: loginform.password.$modelValue
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

    function submitForgot(forgotForm) {      
      if (forgotForm.$invalid) {
        return;
      }
      vcRecaptchaService.execute(vm.widgetId);
    };

    vm.setResponse = setResponse;
    vm.setWidgetId = setWidgetId;
    vm.reloadCaptcha = reloadCaptcha;

    function setWidgetId (widgetId) {
        vm.widgetId = widgetId;
    };
    
    function reloadCaptcha () {
        vcRecaptchaService.reload(vm.widgetId);
        vm.response = null;
    };

    function setResponse (response) {
      if(!response){
        reloadCaptcha();
        return;
      }
      auth.forgotPassword(vm.forgotEmail, $translate.use(), response)
      .then(function () {
        vm.forgotSuccessful = true;
      }).catch(function (result){
        vm.forgotSuccessful = false;
      }).finally(function (){
        reloadCaptcha();
      });
    }
  }
})();
