(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('BillingCtrl', BillingCtrl);

  BillingCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings',
    'utils'
  ];

  function BillingCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, utils) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);
    vm.checkExpDate = checkExpDate;
    vm.submitBilling = submitBilling;

    vm.cc = {number: '', type: {}, mask: ''};
    vm.maskOptions = {
      allowInvalidValue: true //allows us to watch the value
    };

    $scope.$watch('vm.cc.number', fillCreditCardProperties);

    function fillCreditCardProperties(newNumber) {
      vm.cc.type = getCreditCardType(newNumber);
      vm.cc.mask = getMaskType(vm.cc.type);
    }

    function getMaskType(cardType){
    	var masks = {
    	   'mastercard': '9999 9999 9999 9999',
         'visa': '9999 9999 9999 9999',
         'amex': '9999 999999 99999',
         'unknown': '9999 9999 9999 9999'
    	};
      return masks[cardType];
    }

    function getCreditCardType(creditCardNumber) {
    	// start without knowing the credit card type
    	var result = "unknown";

    	// first check for MasterCard
    	if (/^5[1-5]/.test(creditCardNumber)) {
        	result = "mastercard";
    	}
    	// then check for Visa
    	else if (/^4/.test(creditCardNumber)) {
    		result = "visa";
    	}
    	// then check for AmEx
    	else if (/^3[47]/.test(creditCardNumber)) {
    		result = "amex";
    	}
    	return result;
    }

    function checkExpDate(input) {
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear().toString().slice(2);
      var currentMonth = currentDate.getMonth() + 1;
      if (input.$modelValue) {
        var year = input.$modelValue.slice(2);
        var month = input.$modelValue.slice(0,2);
      }

      if (year < currentYear || month > 12) {
        utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
      }
      if (year == currentYear && month < currentMonth) {
        utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
      }
    }

    function submitBilling(form) {
      vm.submitted = true;
      if (!form.$valid) {
        return;
      }
    }




  }

})();