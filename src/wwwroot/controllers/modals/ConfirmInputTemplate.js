(function() {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('ConfirmInputTemplate', ConfirmInputTemplate);
  
      ConfirmInputTemplate.$inject = [
      'close',
      'title',
      'mainText',
      'descriptionInput',
      'confirmationWord',
      'actionSuccess',
      'cancelButtonText',
      'buttonText',
      '$translate'
    ];
  
    function ConfirmInputTemplate(close, title, mainText, descriptionInput, confirmationWord, actionSuccess, cancelButtonText, buttonText, $translate) {
      var vm = this;
      vm.title = title;
      vm.mainText = mainText;
      vm.descriptionInput = descriptionInput;
      vm.cancelButtonText = cancelButtonText;
      vm.buttonText = buttonText;
      vm.confirmationWord = $translate.instant(confirmationWord);
      vm.actionSuccess = function(form) {
        if(!form.$valid) {
          return;
        }
        actionSuccess();
      }
      vm.closeModal = function() {
        close();
      };
    }
  })();
  