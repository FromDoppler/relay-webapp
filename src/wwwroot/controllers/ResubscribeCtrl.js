(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('ResubscribeCtrl', ResubscribeCtrl);

    ResubscribeCtrl.$inject = [
    '$scope',
    '$location',
    'settings',
    '$rootScope',
    'ModalService',
    'utils',
  ];

  function ResubscribeCtrl($scope, $location, settings, $rootScope, ModalService, utils) {
    $rootScope.setSubmenues([        
      { text: 'domains_text', url: 'settings/domain-manager', active: true },
      { text: 'submenu_smtp', url: 'settings/connection-settings', active: false }
    ]);
    var vm = this;
    var queryParams = $location.search();
    vm.domain = queryParams['d'];
    vm.loading = true;
    vm.email = null;
    vm.reason = null;

  vm.sendResubscribe = function(form) {
    vm.submitted = true;

    if (!form.$valid) {
      return;
    }

    settings.resubscribeEmailAddress(vm.email, vm.reason, vm.domain, onExpectedError)
    .then(function() {
      return ModalService.showModal({
      templateUrl: 'partials/modals/general-template.html',
      controller: 'GeneralTemplateCtrl',
      controllerAs: 'vm',
      inputs: {
        title: "resubscribe_success",
        mainText: "resubscribe_success_text",
        buttonText: "resubscribe_success_button",
        action: null
      }
      })
    }).then(function(){          
      utils.resetForm(vm, form);
      vm.submitted = false;
    });
  }

  function onExpectedError(rejectionData) {
    var errorMessage = '';
    var errorButton = '';
    
    if (rejectionData.status == 400 && rejectionData.errorCode == 12) {
      errorMessage = 'resubscribe_internal_policies_error';
      errorButton = 'resubscribe_internal_policies_error_button';
    }

    if (rejectionData.status == 400 && rejectionData.errorCode == 13) {
      errorMessage = 'resubscribe_domain_error';
      errorButton = 'resubscribe_unsubscription_error_button';
    }

    if (rejectionData.status == 400 && rejectionData.errorCode == 14) {
      errorMessage = 'resubscribe_unsubscription_error';
      errorButton = 'resubscribe_unsubscription_error_button';
    }

    if (rejectionData.status == 429 && rejectionData.errorCode == 1) {
      errorMessage = 'resubscribe_too_many_request_error';
      errorButton = 'resubscribe_too_many_request_error_button';
    }

    $rootScope.addError(errorMessage, rejectionData.detail, rejectionData.title, rejectionData.status, rejectionData.errorCode, null, errorButton);
    
    return true;
  }
}
})();
