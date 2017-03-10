(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('settings', settings);

  settings.$inject = [
    '$http',
    '$window',
    '$q',
    'jwtHelper',
    'RELAY_CONFIG',
    '$rootScope',
    'auth'
  ];
  function settings($http, $window, $q, jwtHelper, RELAY_CONFIG, $rootScope, auth) {
    var settingsService = {
      getDomains: getDomains,
      addDomain: addDomain
    };

    return settingsService;

    function addDomain (domain) {
      var actionDescription = 'action_adding_domain';
      /*return $http({
        actionDescription: actionDescription,
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/user?domain=' + domain,
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'token ' + apiKey
        }
      });*/
    }

    function getDomains() {
      return [{
        name: "relay.com",
        status: "default"
      },
      {
        name: "fromdoppler.com",
        status: "disabled"
      },
      {
        name: "makingsense.com",
        status: "disabled"
      }];
        /*return $http({
          actionDescription: 'Gathering report requests',
          method: 'GET',
          url: RELAY_CONFIG.baseUrl + auth.getAccountName() +  '/domains'
        }).then(function (response) {
          return (response.data.items);
        })
        .catch(function (reason) {
          $log.error(reason.error.detail);
          return $q.reject(reason);
        });
    }*/
  }
}
})();
