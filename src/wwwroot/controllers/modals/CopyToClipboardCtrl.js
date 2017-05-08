(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('CopyToClipboardCtrl', CopyToClipboardCtrl);

    CopyToClipboardCtrl.$inject = [
      'close',
      'textToCopy'
    ];

    function CopyToClipboardCtrl(close, textToCopy) {
      var vm = this;
      vm.closeModal = function () {
        close();
      };
      vm.textToCopy = textToCopy;
    }
})();
