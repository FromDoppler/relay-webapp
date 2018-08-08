(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('TemplateCtrl', TemplateCtrl);

  TemplateCtrl.$inject = [
    '$scope',
    'templates',
    '$routeParams',
    '$location'
  ];

  function TemplateCtrl($scope, templates, $routeParams, $location) {

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

    $scope.saveHtmlRaw = saveHtmlRaw;
    $scope.saveAndEditWithMseditor = saveAndEditWithMseditor;

    if ($routeParams["templateId"]) {
      load($routeParams["templateId"]);
    }

    /*************************/
    /* Function declarations */
    /*************************/

    function load(templateId) {
      $scope.loadInProgress = true;

      return templates.getTemplateWithBody(templateId).then(function (result) {
        $scope.template.fromName = result.from_name;
        $scope.template.fromEmail = result.from_email;
        $scope.template.subject = result.subject;
        $scope.template.name = result.name;
        $scope.template.id = result.id;
        $scope.template.content = result.body;
      }).finally(function () {
        $scope.loadInProgress = false;
      });
    }

    function save() {
      $scope.saveInProgress = true;
      return templates.save({
        from_name: $scope.template.fromName,
        from_email: $scope.template.fromEmail,
        subject: $scope.template.subject,
        body: $scope.template.content,
        name: $scope.template.name,
        id: $scope.template.id
      }).finally(function () {
        $scope.saveInProgress = false;
      });
    }

    function saveHtmlRaw() {
      if ($scope.form.$invalid) {
        return;
      }
      return save().then(function (result) {
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
      return save().then(function (result) {
          location.href = location.origin + '/template-editor/?idCampaign=' + result;
      });
    }
  }

})();
