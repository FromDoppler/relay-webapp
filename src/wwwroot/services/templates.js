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
      getTemplateWithBody: getTemplateWithBody,
      save: save,
      deleteTemplate: deleteTemplate,
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

    function getTemplateWithBody(templateId) {
      return getTemplate(templateId).then(function (template) {
        return getTemplateBody(templateId).then(function (body) {
          return {
            from_name: template.from_name,
            from_email: template.from_email,
            subject: template.subject,
            id: template.id,
            name: body.name,
            body: body.html
          };
        });
      });
    }

    function save(templateModel) {
      var accountId = auth.getAccountId();
      var isCreating = !templateModel.id;
      var updateTemplatePromise = isCreating ? createTemplate(accountId, templateModel) : editTemplate(accountId, templateModel);
      return updateTemplatePromise.then(function (templateId) {
        return editTemplateBody(accountId, templateId, templateModel.name, templateModel.body).then(function () {
          return templateId;
        }).catch(function (reason) {
          // TODO: Show a special message error when template was update but body fails
          return $q.reject(reason);
        });
      });
    }

    function createTemplate(accountId, templateModel) {
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

    function editTemplate(accountId, templateModel) {
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

    function editTemplateBody(accountId, templateId, name, body) {
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
  }

})();
