(function () {
    'use strict';
  
    angular
      .module('dopplerRelay')
      .controller('ChangeEmailCtrl', ChangeEmailCtrl);
  
      ChangeEmailCtrl.$inject = [
      '$translate',
      'signup',
      'auth',
      'settings',
      '$location',
      '$rootScope',
      '$q',
      'utils',
      '$scope',
      'resources'
    ];
  
    function ChangeEmailCtrl($translate, signup, auth, settings, $location, $rootScope, $q, utils, $scope, resources) {
        
        auth.changeEmail($translate.use())
        .then(function () {
            $location.path('/settings/my-profile');
        })
        .catch(function(rejectionData){
            var data = rejectionData.data || { };
            $rootScope.addAuthorizationError(data.detail, data.status, data.errorCode);
        });
    }
  })();
  