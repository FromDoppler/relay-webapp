(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .directive('selectInputText', selectInputText);
      
    selectInputText.$inject = [
    ];      

    function selectInputText() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.value, function () {
                    element[0].focus();
                    element[0].setSelectionRange(0, element[0].value.length);
                });
            }
        };
    }
})();