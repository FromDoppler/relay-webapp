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
    'isAuthorizationModal',
    'functionToCall',
    'buttonText'
  ];

  function ErrorCtrl($scope, close, $route, description, actionDescription, rejectionTitle, statusCode, errorCode, isAuthorizationModal, functionToCall, buttonText) {
    var vm = this;
    vm.errorMessage = description;
    vm.actionDescription = !actionDescription ? null : actionDescription;
    vm.rejectionTitle = rejectionTitle ? null : rejectionTitle;
    vm.statusCode = statusCode;
    vm.errorCode = errorCode;
    vm.isAuthorizationModal = isAuthorizationModal;
    vm.functionToCall = functionToCall;
    vm.buttonText = buttonText;
    vm.actionButton = function() {
      close();
      if (!vm.functionToCall) {
        $route.reload();
      }
      vm.functionToCall();
    };
    vm.closeModal = function() {
      close(vm.statusCode);
    };
  }
})();
