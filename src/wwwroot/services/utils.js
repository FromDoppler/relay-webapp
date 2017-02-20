(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('utils', utils);

  utils.$inject = [
    '$http',
    '$window',
    '$q',
    'RELAY_CONFIG',
    '$rootScope'
  ];


  function utils($http, $window, $q, RELAY_CONFIG, $rootScope) {

    var utilsService = {
      analizePasswordComplexity: analizePasswordComplexity,
      setServerValidationToField: setServerValidationToField
    };

    return utilsService;

    function analizePasswordComplexity(password) {
      var SAME = /^(.)\1+$/;
      if (password && password.length >= 8 && !SAME.test(password)) {

        var LOWER = /[a-z]/,
          UPPER = /[A-Z]/,
          DIGIT = /[0-9]/,
          SPECIAL = /\W/;

        var lower = LOWER.test(password),
            upper = UPPER.test(password),
            digit = DIGIT.test(password),
            special = SPECIAL.test(password);

        if (lower && upper && digit || special) {
          return {
            strength: 'strong',
            result: true,
            position: 2
          };
        }

        if (lower && upper || lower && digit || upper && digit) {
          return {
            strength: 'good',
            result: true,
            position: 1
          };
        }

      }

      return {
        strength: 'weak',
        result: false,
        position: 2
      };
    }

    function setServerValidationToField(scope, formField, errorName) {
      // It is a quick and dirty way to set a validation error that is removed when 
      // a change is detected.
      formField.$setValidity(errorName, false);
      var deregister = scope.$watch(function () { return formField.$modelValue; }, function (newVal, oldVal) {
        if (newVal != oldVal) {
          formField.$setValidity(errorName, null);
          deregister();
        }
      });
    }

  }
})();
