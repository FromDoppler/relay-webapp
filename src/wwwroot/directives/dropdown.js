(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('dropdown', dropdown);

    dropdown.$inject = [
      
    ];

    function dropdown() {
        var directive = {
            restrict: 'E',
            link: link,
            scope: {
                selectedOption: '=',
                options: '=',
                records: '=',
                change: '='
            },
            templateUrl: 'partials/directives/dropdown.html',
        };

        return directive;

        function link(scope, element, attrs) {
            scope.expanded = false;
            scope.toggleVisibility = function () {
                scope.expanded = !scope.expanded;
            };

            scope.selected = function (opt) {
                scope.selectedOption = opt;
                scope.change(opt);
            };
        }
    }

})();
