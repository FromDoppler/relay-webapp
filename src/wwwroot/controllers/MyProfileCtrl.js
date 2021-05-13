(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('MyProfileCtrl', MyProfileCtrl);

  MyProfileCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings'
  ];

  function MyProfileCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: true },
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: false },
      { text: 'submenu_my_billing_information', url: 'settings/my-billing-information', active: false }
    ]);
    vm.changePassword = changePassword;
    vm.updateValidation = updateValidation;
    vm.changeUsername = changeUsername;
    vm.resetPasswordContainer = resetPasswordContainer;
    vm.resetUsernameContainer = resetUsernameContainer;
   
    vm.username = auth.getUserName();

    function updateValidation(form) {
      if (!form.pass.$modelValue || !form.confPass.$modelValue) {
        form.confPass.$setValidity('same', null);
      } else if (form.pass.$modelValue != form.confPass.$modelValue) {
        form.confPass.$setValidity('same', false);
      } else {
        form.confPass.$setValidity('same', true);
      }
    }

    function changePassword(form) {
      vm.passSubmitted = true;

      if (form.pass.$modelValue != form.confPass.$modelValue || !form.$valid) {
        return;
      }
      auth.changePassword(form.oldPass.$modelValue, form.pass.$modelValue, $translate.use())
      .then(function() {
        resetPasswordContainer();
        vm.changePasswordSuccess = true;
        $timeout(function(){
          vm.changePasswordSuccess = false;
        }, 1500);
      })
      .catch(function(rejectionData){
        var data = rejectionData.data || { };
        if (data.errorCode == 2 && data.status == 401) {
          vm.wrongOldPassword = true;
        } else {
          $rootScope.addError('action_updating_password', data.detail, data.title, data.status, data.errorCode);
        }
      });
    }

    function changeUsername(form) {
      vm.usernameSubmitted = true;
      vm.existingEmail = false;

      if (!form.$valid) {
        return;
      }
      
       settings.requestEmailChange(form.username.$modelValue, $translate.use())
        .then(function() {
          vm.emailActivationPending = true;
          resetUsernameContainer();
       })
       .catch(function(rejectionData){
         var data = rejectionData.data || { };
         if (data.errorCode == 7 && data.status == 400) {
           vm.existingEmail = true;
         } else {
           $rootScope.addError('action_updating_email', data.detail, data.title, data.status, data.errorCode);
         }
       });
      
    }

    function resetUsernameContainer(){
      vm.showUserNameContainer = false;
      vm.existingEmail = false;
      vm.username = auth.getUserName();
    }

    function resetPasswordContainer(){
      vm.showChangePassContainer = false;
      vm.pass = '';
      vm.oldPass = '';
      vm.confPass = '';
    }
  }

})();
