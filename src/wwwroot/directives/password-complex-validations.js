(function () {
  'use strict';

  angular
      .module('dopplerRelay')
      .directive('passwordComplexValidation', passwordComplexValidation);
  passwordComplexValidation.$inject = [
    'utils'
  ];
  function passwordComplexValidation(utils) {
    var directive = {
      restrict: 'A',
      link: link,
      require: 'ngModel',
      scope: {
        pass: '='
      }
    };

    return directive;

    function link(scope, element, iAttrs, ctrl) {
      scope.$watch('pass', function () {
        if (!scope.pass) {
          ctrl.$setValidity('strength', null);
          return;
        }
        var passGrade = utils.analizePasswordComplexity(scope.pass);
        ctrl.$setValidity('strength', passGrade.result);

        // TODO: take into account passGrade.strength and passGrade.position to render better information
      });
    }
  }

})();
