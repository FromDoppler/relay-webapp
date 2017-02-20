(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ErrorCtrl', ErrorCtrl);

  ErrorCtrl.$inject = [
    '$scope',
    'close',
    '$route',
    'description',
    'actionDescription',
    'rejectionTitle',
    'statusCode',
    'errorCode',
    'isAuthorizationModal'
  ];

  function ErrorCtrl($scope, close, $route, description, actionDescription, rejectionTitle, statusCode, errorCode, isAuthorizationModal) {
    var vm = this;
    vm.errorMessage = description;
    vm.actionDescription = !actionDescription ? null : actionDescription;
    vm.rejectionTitle = rejectionTitle ? null : rejectionTitle;
    vm.statusCode = statusCode;
    vm.errorCode = errorCode;
    vm.isAuthorizationModal = isAuthorizationModal;
    vm.refresh = function() {
      close();
      $route.reload();
    };
    vm.closeModal = function() {
      close(vm.statusCode);
    };
  }
})();
