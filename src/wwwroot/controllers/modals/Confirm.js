(function() {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('Confirm', Confirm);
  
      Confirm.$inject = [
      'close',
      'title',
      'mainText',
      'actionSuccess',
      'cancelButtonText',
      'buttonText'
    ];
  
    function Confirm(close, title, mainText, actionSuccess, cancelButtonText, buttonText) {
      var vm = this;
      vm.title = title;
      vm.mainText = mainText;
      vm.cancelButtonText = cancelButtonText;
      vm.buttonText = buttonText
      vm.actionSuccess = function() {
        actionSuccess();
        close();
      }
      vm.closeModal = function() {
        close();
      };
    }
  })();
  