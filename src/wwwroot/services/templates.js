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
      getTemplateBody: getTemplateBody,
      createTemplate: createTemplate,
      editTemplate: editTemplate,
      editTemplateBody: editTemplateBody,
      deleteTemplate: deleteTemplate,
      getUserProfile: getUserProfile
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
      }).then(extractData);
    };

    function getTemplateBody(id) {
      var accountId = auth.getAccountId();

      return $http({
        actionDescription: 'action_templates_getting_body',
        method: 'GET',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + id + '/body'
      }).then(extractData);
    }

    function createTemplate(templateModel) {
      var accountId = auth.getAccountId();
      return $http({
        actionDescription: 'action_templates_creating',
        method: 'POST',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates',
        data: {
          from_name: templateModel.from_name,
          from_email: templateModel.from_email,
          subject: templateModel.subject,
          name: templateModel.name
        }
      }).then(function (result) {
        return result.data.createdResourceId;
      });
    }

    function editTemplate(templateModel) {
      var accountId = auth.getAccountId();
      return $http({
        // TODO: check action description
        actionDescription: 'Editing a template',
        method: 'PUT',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + templateModel.id,
        data: {
          from_name: templateModel.from_name,
          from_email: templateModel.from_email,
          subject: templateModel.subject,
          name: templateModel.name,
          id: templateModel.id
        }
      }).then(function () {
        return templateModel.id;
      });
    }

    function editTemplateBody(templateId, name, body) {
      var accountId = auth.getAccountId();
      return $http({
        actionDescription: 'Editing a template body',
        method: 'PUT',
        url: RELAY_CONFIG.baseUrl + '/accounts/' + accountId + '/templates/' + templateId + '/body',
        data: {
          html: body
        }
      });
    }

    function extractData(response) {
      return response.data;
    }

    function getUserProfile() {
      return auth.getProfile();
    }
  }

})();
