(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('GeneralTemplateCtrl', GeneralTemplateCtrl);

  GeneralTemplateCtrl.$inject = [
    'close',
    'title',
    'mainText',
    'buttonText'
  ];

  function GeneralTemplateCtrl(close, title, mainText, buttonText) {
    var vm = this;
    vm.title = title;
    vm.mainText = mainText;
    vm.buttonText = buttonText;
    vm.closeModal = function() {
      close();
    };
  }
})();
