(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('templates', Templates);

  Templates.$inject = [
    '$http',
    '$window',
    '$q',
    'auth',
    'RELAY_CONFIG'
  ];

  function Templates($http, $window, $q, auth, RELAY_CONFIG) {

    var templatesService = {
      getAllData: getAllData,
      getTemplate: getTemplate,
      save: save,
      deleteTemplate: deleteTemplate
    };

    return templatesService;

    function getAllData() {
      var accountId = auth.getAccountId();

      return $http({
        actionDescription: 'action_templates_gathering',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates'
      });
    }

    function deleteTemplate(id) {
      var accountId = auth.getAccountId();

      return $http({
        actionDescription: 'action_templates_deleting',
        method: 'DELETE',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + id
      });
    }

    function getTemplate(id) {
      // TODO: It is a dummy implementation
      var accountId = auth.getAccountId();

      return $http({
        actionDescription: 'action_templates_getting',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + id
      })
          .then(function (result) {
            return result.data;
          });
    };

    function save(model) {
      var accountId = auth.getAccountId();

      var isCreating = !model.id;

      var request = { data: model };

      if (isCreating) {
        request.actionDescription = 'action_templates_creating',
        request.method = 'POST',
        request.url = RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates';
      } else {
        request.actionDescription = '"Editing a template"',
        request.method = 'PUT',
        request.url = RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + model.id;
      }

      return $http(request).then(function (result) {
        return isCreating ? result.createdResourceId : model.id;
      });
    }
  }

})();
