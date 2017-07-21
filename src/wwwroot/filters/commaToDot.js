(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .filter('commaToDot', function () {
          return function (input) {
            var ret=(input)?input.toString().replace(/,/g,"."):null;
            return ret;
          };
      });
})();