(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('settings', settings);

  settings.$inject = [
    '$http',
    '$q',
    'RELAY_CONFIG'
  ];
  function settings($http, $q, RELAY_CONFIG) {
    var settingsService = {
      getDomains: getDomains,
      addDomain: addDomain
    };

    return settingsService;

    function addDomain (domain) {
      var actionDescription = 'action_adding_domain';

      var deferred = $q.defer();
      deferred.resolve("Fake $http call");

      return deferred.promise;
    }

    function getDomains() {
      var response = $q.defer();

      setTimeout( function() {
        var data = {
          domains: [{
            name: "relay.com",
          },
          {
            name: "fromdoppler.com",
            disabled: true
          },
          {
            name: "makingsense.com",
            disabled: true
          }],
          defaultDomain: "relay.com"
        };

        response.resolve(data);
      }, 500 );

      return response.promise;
  }
}
})();
