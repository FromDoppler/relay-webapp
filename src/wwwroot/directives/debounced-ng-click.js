(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('debouncedNgClick', debouncedNgClick);

    debouncedNgClick.$inject = [
    ];

    function debouncedNgClick() {
        var directive = {
            restrict: 'A',
            link: link,
            scope: {
                debouncedNgClick: '&'
            }
        };

        return directive;

        function link(scope, element, attrs) {
            element.on('click', function () {
                if (!scope.promise || !scope.promise.$$state || scope.promise.$$state.status)
                {
                    scope.promise = scope.debouncedNgClick();
                }
            });
        }
    }
})();