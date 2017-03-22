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
      addDomain: addDomain,
      setDefaultDomain: setDefaultDomain
    };

    return settingsService;

    function addDomain (domain) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + domain;

      return $http({
        actionDescription: 'action_adding_domain',
        method: 'PUT',
        url: url
      });
    }

    function setDefaultDomain (domain) {
      var url = RELAY_CONFIG.baseUrl
        + '/accounts/' + auth.getAccountName()
        + '/domains/'
        + '/defaultDomain';

      return $http({
        actionDescription: 'action_setting_default_domain',
        method: 'PUT',
        data: domain,
        url: url
      });
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
