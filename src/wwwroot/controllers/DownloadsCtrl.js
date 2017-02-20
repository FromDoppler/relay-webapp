(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .controller('DownloadsCtrl', DownloadsCtrl);

    DownloadsCtrl.$inject = [
      '$scope',
      'reports'
    ];

    function DownloadsCtrl($scope, reports) {
        $scope.records = [];
        $scope.searchInProgress = false;

        $scope.getRecords = function () {
            $scope.searchInProgress = true;
            reports.getReportRequests()
                .then(function (result) {
                    $scope.records = result;
                })
                .catch(function () {
                    // todo: Redirects to error view.
                })
                .finally(function () {
                    $scope.searchInProgress = false;
                });
        }

        $scope.getRecords();
    }

})();
