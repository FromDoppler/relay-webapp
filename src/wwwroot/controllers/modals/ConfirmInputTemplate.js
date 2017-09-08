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
      'inputPlaceHolder',
      'action',
      'cancelButtonText',
      'buttonText'
    ];
  
    function ConfirmInputTemplate(close, title, mainText, descriptionInput, inputPlaceHolder, action, cancelButtonText, buttonText) {
      var vm = this;
      vm.title = title;
      vm.mainText = mainText;
      vm.descriptionInput = descriptionInput;
      vm.inputPlaceHolder = inputPlaceHolder;
      vm.cancelButtonText = cancelButtonText;
      vm.buttonText = buttonText;
      vm.action = function(){
        action();
      }
      vm.closeModal = function() {
        close();
      };
    }
  })();
  