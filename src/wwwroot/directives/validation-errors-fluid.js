(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .directive('validationErrorsFluid', validationErrorsFluid);

  validationErrorsFluid.$inject = [
    "$compile"
  ];

  function validationErrorsFluid($compile) {
    var directive = {
      restrict: 'A',
      require: ['^form', 'ngModel'],
      link: function (scope, element, attrs, ctrls) {
        var formCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];
        var formName = formCtrl.$name;
        var fieldName = ngModelCtrl.$name;
        var validationErrorsFluidElement = angular.element(
          '<div class="validation-error-fluid" '
          + 'ng-class="(' + formName + '.' + fieldName + '.$invalid && (' + formName + '.$submitted || (' + formName + '.' + fieldName + '.$touched && ' + formName + '.' + fieldName + '.$dirty))) ? &quot;show&quot; : &quot;hide&quot;">'
          + '  <span ng-repeat="(errorKey, error) in ' + formName + '.' + fieldName + '.$error">'
          + '    <i class="arrow--up"></i>'
          + '    {{"validation_error_"+ errorKey | translate}}'
          + '  </span>'
          + '</div>');
        element.after(validationErrorsFluidElement);
        $compile(validationErrorsFluidElement)(scope);
      }
    };
    return directive;
  }
})();
