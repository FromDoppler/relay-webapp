(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('TemplateCtrl', TemplateCtrl);

  TemplateCtrl.$inject = [
    '$scope',
    'templates',
    '$routeParams',
    '$location',
    '$rootScope'
  ];

  function TemplateCtrl($scope, templates, $routeParams, $location, $rootScope) {

    $scope.template = {
      id: "",
      subject: "",
      fromEmail: "",
      fromName: "",
      name: "",
      content: ""
    };

    $scope.loadInProgress = false;
    $scope.saveInProgress = false;
    $scope.isHtmlTemplate = true;

    $scope.saveTemplate = saveTemplate;
    $scope.saveAndEditWithMseditor = saveAndEditWithMseditor;

    if ($routeParams["templateId"]) {
      load($routeParams["templateId"]);
    } else {
      $scope.isHtmlTemplate = !$rootScope.forceMsEditor;
    }

    /*************************/
    /* Function declarations */
    /*************************/

    function load(templateId) {
      $scope.loadInProgress = true;
      return templates.getTemplate(templateId).then(function (template) {
        $scope.template.fromName = template.from_name;
        $scope.template.fromEmail = template.from_email;
        $scope.template.subject = template.subject;
        $scope.template.name = template.name;
        $scope.template.id = template.id;
        $scope.isHtmlTemplate = template.bodyType == "rawHtml" || (template.bodyType == "empty" && !$rootScope.forceMsEditor);
        if (!$scope.isHtmlTemplate) {
          $scope.template.content = null;
        } else {
          return templates.getTemplateBody(templateId).then(function(templateBody) {
            $scope.template.content = templateBody.html;
          });
        }
      }).finally(function () {
        $scope.loadInProgress = false;
      });
    }

    function save() {
      $scope.saveInProgress = true;
      var templateModel = {
        from_name: $scope.template.fromName,
        from_email: $scope.template.fromEmail,
        subject: $scope.template.subject,
        body: $scope.template.content,
        name: $scope.template.name,
        id: $scope.template.id
      }
      var isCreating = !$scope.template.id;
      var saveTemplatePromise = isCreating ? templates.createTemplate(templateModel) : templates.editTemplate(templateModel);
      return saveTemplatePromise.then(function(templateId) {
        if ($scope.isHtmlTemplate) {
          return templates.editTemplateBody(templateId, templateModel.name, templateModel.body).then(function() {
            return templateId;
          })
          .catch(function (reason) {
            // TODO: Show a special message error when template was update but body fails
            return $q.reject(reason);
          });
        } else {
          return templateId;
        }
      }).finally(function () {
        $scope.saveInProgress = false;
      });
    }

    function saveTemplate() {
      if ($scope.form.$invalid) {
        return;
      }
      save().then(function () {
        $location.path('/templates');
      });
    }

    function saveAndEditWithMseditor() {
      // This is for replicating submit behaviour.
      $scope.form.$submitted = true;
      $scope.submitted = true;

      if ($scope.form.$invalid) {
        return;
      }
      save().then(function(templateId) {
        location.href = location.origin + '/template-editor/?idCampaign=' + templateId;
      });
    }
  }

})();
