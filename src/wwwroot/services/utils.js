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
      replaceAllCharsExceptLast4: replaceAllCharsExceptLast4,
      validateCreditCard : validateCreditCard,
      removeDuplicates: removeDuplicates,
      getPreferredLanguage: getPreferredLanguage,
      setPreferredLanguage: setPreferredLanguage,
      hasDifferentDomain: hasDifferentDomain,
      getMultiAccountUsers: getMultiAccountUsers
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

    //This was taken from: https://gist.github.com/DiegoSalazar/4075533
    function validateCreditCard(value) {
      // accept only digits, dashes or spaces
    	if (/[^0-9-\s]+/.test(value)) return false;

    	// The Luhn Algorithm.
    	var nCheck = 0, nDigit = 0, bEven = false;
    	value = value.replace(/\D/g, "");

    	for (var n = value.length - 1; n >= 0; n--) {
    		var cDigit = value.charAt(n),
    			  nDigit = parseInt(cDigit, 10);

    		if (bEven) {
    			if ((nDigit *= 2) > 9) nDigit -= 9;
    		}

    		nCheck += nDigit;
    		bEven = !bEven;
    	}

    	return (nCheck % 10) == 0;
    }

    function removeDuplicates(arr){
        var o = {};
        for(var e = 0; e < arr.length; e++) {
          o[arr[e]] = true;
        }
        return Object.keys(o);
      }

    function getPreferredLanguage(){
      return $window.localStorage.getItem('lang');
    }

    function setPreferredLanguage(key){
      $window.localStorage.setItem('lang', key);
    }

    function hasDifferentDomain() {      
      return !(/relay/.test($window.location.host));
    }
    function getMultiAccountUsers() {
      return [
        { companyName: 'Gire', logoName: 'gire-logo-grey', domain: 'localhost', companyLink: "http://giresoluciones.com.ar" },
        { companyName: 'Test', logoName: 'american-card', domain: 'test.com', companyLink: "http://test.com.ar" }
      ];
    }

  }
})();
