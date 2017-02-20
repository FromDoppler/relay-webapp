(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('TemplatesCtrl', TemplatesCtrl);

  TemplatesCtrl.$inject = [
    '$scope',
    '$timeout',
    'templates'
  ];

  function TemplatesCtrl($scope, $timeout, templates) {
    $scope.content = 'Templates section';
    $scope.searchInProgress = true;
    $scope.items = null;
    $scope.deleteTemplate = deleteTemplate;
    $scope.deleteDialogs = new Array();
    $scope.toggleDeleteDialog = toggleDeleteDialog;
    $scope.hideDeleteDialog = hideDeleteDialog;

    initialize();


    function hideDeleteDialog(id) {
      $scope.deleteDialogs[id] = false;
    }

    function toggleDeleteDialog(id) {
      $scope.deleteDialogs[id] = !$scope.deleteDialogs[id];
    }

    function deleteTemplate(template) {
      template.removingStatus = true;
      templates.deleteTemplate(template.id)
        .then(function (result) {
          $timeout(function () {
            var i = $scope.items.indexOf(template);
            if (i != -1) {
              $scope.items.splice(i, 1);
            }
          }, 100);
        })
        .catch(function () {
          template.removingStatus = false;
          // TODO: do something with the error
        })
        .finally(function () {
        });
    }

    function getItems() {
      $scope.searchInProgress = true;
      templates.getAllData()
        .then(function (result) {
          $scope.items = result.data.items;
        })
        .catch(function () {
          // TODO: do something with the error
        })
        .finally(function () {
          $scope.searchInProgress = false;
        });
    }

    function initialize() {
      getItems();
    }
  }
})();
