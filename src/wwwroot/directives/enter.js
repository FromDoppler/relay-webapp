(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('enter', enter);

    function enter() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enter);
                    });

                    event.preventDefault();
                }
            });

            scope.$on('$destroy', function () {
                // unbind here
                element.unbind("keydown keypress");
            });
        }
    }

})();