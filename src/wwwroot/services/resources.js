(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('resources', resources);

  resources.$inject = [
    '$http',
    '$q',
    'RELAY_CONFIG',
    '$rootScope',
    '$translate'
  ];

  function resources($http, $q, RELAY_CONFIG, $rootScope, $translate) {

    var resourcesService = {
      ensureCountries: ensureCountries,
      ensureIndustries: ensureIndustries,
      ensureConsumerType: ensureConsumerType,
      data: []
    };

    var promises = {};
    var responses = {};

    return resourcesService;

    function ensureCountries() {
      return ensure("countries");
    }

    function ensureIndustries() {
      return ensure("industries");
    }

    function ensureConsumerType() {
      return ensure("consumerType");
    }

    function ensure(resource) {
      
      if (resourcesService.data[resource] == null) {

        // The first time, to avoid error in views
        resourcesService.data[resource] = [];
      }

      if (!promises[resource]) {
        
        // The first time, or after a failure
        promises[resource] = getResource(resource + ".json")
          .then(function(ret) {
            $rootScope.$on('$translateChangeSuccess', function() { translate(resource); });
            responses[resource] = ret.data;
            return translate(resource);
          })
          .catch(function(ret) {
            promises[resource] = null;
            throw ret;
          });
      }

      return promises[resource];
    }

    function translate(resource) {
      var lang = $translate.use();
      resourcesService.data[resource] = responses[resource].map(function(val){
        return { code: val.code, name: val[lang] };
      });

      if(resource == 'countries'){
        resourcesService.data[resource].forEach(element => {
          var country = responses[resource].filter(c=>c.code==element.code);
          if (typeof country[0].provinces !== 'undefined' && country[0].provinces.length > 0) {
            element.provinces = country[0].provinces.map(function(val){
              return { code: val.code, name: val[lang] };
            });        
          }        
        });
      }

      return resourcesService.data[resource];
    }

    function getResource(resourceFileName) {
      
      var actionDescription = 'action_getting_resource';
        return $http({
          actionDescription: actionDescription,
          method: 'GET',
          url: RELAY_CONFIG.baseUrl + '/resources/' + resourceFileName
        });
    }
}
})();