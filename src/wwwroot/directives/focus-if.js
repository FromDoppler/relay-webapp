(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('focusIf', focusIf);

    focusIf.$inject = [
      '$timeout'
    ];

    function focusIf($timeout) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link($scope, $element, $attrs) {
          /// We can also add focus-delay="xxms" in the element for a delayed focus.
          var dom = $element[0];
          if ($attrs.focusIf) {
              $scope.$watch($attrs.focusIf, focus);
          } else {
              focus(true);
          }
          function focus(condition) {
              if (condition) {
                  $timeout(function() {
                      dom.focus();
                  }, $scope.$eval($attrs.focusDelay) || 0);
              }
          }
        }
    }
})();
