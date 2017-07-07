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
      setServerValidationToField: setServerValidationToField,
      resetForm: resetForm,
      replaceAllCharsExceptLast4: replaceAllCharsExceptLast4
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

    function resetForm(vm, form, defaultValues) {
      var undefined = {}["undefined"]; // It is not a good practice to use the `undefined` because it is not a reserved word
      defaultValues = defaultValues || {}; // defaultValues is to allow to set default model values in place of null
      for (var name in form) {
        if (name.indexOf('$') !== 0) {
          var control = form[name];
          control.$setViewValue(undefined);
          vm[control.$name] = defaultValues[control.$name] || null;
        }
      }
      form.$setPristine();
      form.$setUntouched();
    }

    function replaceAllCharsExceptLast4(str) {
      var length = str.toString().length - 4;
      if (length < 4) {
        return str.replace(/\S/gi, '*');;
      }
      return str.replace(/\S/gi,
        function myFunction(x,i){
          if (i < length) {
            return "*";
          }
          return x;
        });
    }

  }
})();
