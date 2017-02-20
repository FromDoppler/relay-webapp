(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('spinner', spinner);

    spinner.$inject = [

    ];

    function spinner() {
        var directive = {
            restrict: 'E',
            controller: function ($scope) {
            },
            scope: false,
            templateUrl: 'partials/directives/spinner.html',
        };

        return directive;
    }

})();
