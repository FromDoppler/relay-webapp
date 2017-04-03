(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('focusElement', focusElement);

    focusElement.$inject = [
    ];

    function focusElement($timeout) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
          ///Focus element by Id.
          element.on('click',function(){
              document.querySelector("#" + attrs.focusElement).focus();
          });
        }
    }
})();
