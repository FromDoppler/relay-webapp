// This filter is a complement of number filter
// when input is truly (for example "0.00" string) it returns the input if it is falsy it returns '-'
// TODO: replace original number filter by a combination of original number filter and number formatFilter

(function () {
    'use strict';

    angular
      .module('dopplerRelay')
      .filter('numberFormat', function () {
          return function (input, suffix) {
            return suffix && input && input + suffix || input || "-";
          };
      });
})();