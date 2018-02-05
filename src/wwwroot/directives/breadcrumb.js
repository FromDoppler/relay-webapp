(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('breadcrumb', breadcrumb);

      breadcrumb.$inject = [
        '$location'
    ];

    function breadcrumb() {
        var directive = {
            restrict: 'E',
            controller: function ($scope, $location) {
                var url = $location.path().split('/');
                var obj = { folder: url[1] };
                for (var i=0; i < url.length - 1; i++) {
                    if(url[i]){
                        obj['previous'] = url[i];
                        obj['previousText'] = url[i].replace(/-/g, '_');
                        obj['currentText'] = url[i+1].replace(/-/g, '_');
                    }
                }
                $scope.url = obj;
            },
            scope: false,
            templateUrl: 'partials/directives/breadcrumb.html',
        };
        return directive;
    }

})();
