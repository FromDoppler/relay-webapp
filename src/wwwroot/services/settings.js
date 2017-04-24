(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('settings', settings);

  settings.$inject = [
    '$http',
    '$q',
    'RELAY_CONFIG',
    'auth'
  ];
  function settings($http, $q, RELAY_CONFIG, auth) {
    var settingsService = {
      getDomains: getDomains,
      createOrEditDomain: createOrEditDomain,
      setDefaultDomain: setDefaultDomain,
      deleteDomain: deleteDomain
    };

    return settingsService;

    function createOrEditDomain (domainName, isDisabled, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + domainName;

      var data = {};
      if (isDisabled) {
        data['disabled'] = true;
      }

      return $http({
        actionDescription: 'action_adding_domain',
        tryHandleError: function(rejection){ return tryHandleError(rejection, onExpectedError); },
        method: 'PUT',
        data: data,
        url: url
      });
    }

    function setDefaultDomain (domainName) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains'
        + '/default';

      return $http({
        actionDescription: 'action_setting_default_domain',
        method: 'PUT',
        data: {
          'name': domainName
        },
        url: url
      });
    }

    function deleteDomain (domainName, onExpectedError) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + domainName;

      return $http({
        actionDescription: 'action_deleting_domain',
        tryHandleError: function(rejection){ return tryHandleError(rejection, onExpectedError); },
        method: 'DELETE',
        data: {},
        url: url
      });
    }

    function tryHandleError(rejection, onExpectedError) {
        if (rejection.status != 400 || !rejection.data || rejection.data.errorCode != 4) {
          return false; // not handled
        }
        return onExpectedError(rejection.data);
    }

    function getDomains() {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains';

      return $http({
        actionDescription: 'Getting domains',
        method: 'GET',
        url: url
      })
      .then(function (response) {
        return response;
      });
    }
}
})();
