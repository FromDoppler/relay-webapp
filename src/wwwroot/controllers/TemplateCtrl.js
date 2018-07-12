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

    $scope.save = save;

    if ($routeParams["templateId"]) {
      load($routeParams["templateId"]);
    }

    /*************************/
    /* Function declarations */
    /*************************/

    function load(templateId) {
      $scope.loadInProgress = true;

      templates.getTemplateWithBody(templateId).then(function (result) {
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
      if ($scope.form.$invalid) {
        return;
      }

      $scope.saveInProgress = true;
      templates.save({
        from_name: $scope.template.fromName,
        from_email: $scope.template.fromEmail,
        subject: $scope.template.subject,
        body: $scope.template.content,
        name: $scope.template.name,
        id: $scope.template.id
      }).then(function (result) {
        $scope.template.id = result;
        $location.path('/templates');
      }).catch(function () {
        // TODO: do something with the error
      }).finally(function () {
        $scope.saveInProgress = false;
      });
    }
  }

})();
