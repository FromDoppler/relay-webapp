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
      getDomains: getDomains
      //addDomain: addDomain  //This will be commented until add domain it's implemented.
    };

    return settingsService;
    //This will be commented until add domain it's implemented.
    /*function addDomain (domain) {
      var actionDescription = 'action_adding_domain';

      var deferred = $q.defer();
      deferred.resolve("Fake $http call");

      return deferred.promise;
    }*/

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
