(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('GeneralTemplateCtrl', GeneralTemplateCtrl);

  GeneralTemplateCtrl.$inject = [
    'close',
    'title',
    'mainText',
    'buttonText',
    'action'
  ];

  function GeneralTemplateCtrl(close, title, mainText, buttonText, action) {
    var vm = this;
    vm.title = title;
    vm.mainText = mainText;
    vm.buttonText = buttonText;
    vm.closeIcon = function() {
      close();
    };
    vm.closeModal = function() {
      if (!action) {
        close();
        return;
      }
      action();
      close();
    };
  }
})();
