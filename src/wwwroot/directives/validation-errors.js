(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .directive('validationErrors', validationErrors);

  validationErrors.$inject = [
    "$compile"
  ];

  function validationErrors($compile) {
    var directive = {
      restrict: 'A',
      require: ['^form', 'ngModel'],
      link: function (scope, element, attrs, ctrls) {
        var formCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];
        var formName = formCtrl.$name;
        var fieldName = ngModelCtrl.$name;
        var validationErrorsElement = angular.element(
          '<div class="validation-error" '
          + 'ng-show="' + formName + '.' + fieldName + '.$invalid && (' + formName + '.$submitted || (' + formName + '.' + fieldName + '.$touched && ' + formName + '.' + fieldName + '.$dirty))">'
          + '  <span ng-repeat="(errorKey, error) in ' + formName + '.' + fieldName + '.$error">'
          + '    {{"validation_error_" + errorKey | translate}}'
          + '  </span>'
          + '</div>');
        element.after(validationErrorsElement);
        $compile(validationErrorsElement)(scope);
      }
    };
    return directive;
  }
})();
