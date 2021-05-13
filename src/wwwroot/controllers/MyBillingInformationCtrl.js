(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('MyBillingInformationCtrl', MyBillingInformationCtrl);

    MyBillingInformationCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings',
    'utils',
    'resources',
    'ModalService'
  ];

  var secCodeMasksByBrand = {
    'mastercard': '999',
    'visa': '999',
    'amex': '9999',
    'unknown': '999'
  };

  var creditCardMasksByBrand = {
     'mastercard': '9999 9999 9999 9999',
     'visa': '9999 9999 9999 9999',
     'amex': '9999 999999 99999',
     'unknown': '9999 9999 9999 9999'
  };

  function MyBillingInformationCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, utils, resources, ModalService) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: false },
      { text: 'submenu_my_billing_information', url: 'settings/my-billing-information', active: true }
    ]);

    vm.activationPromise = activate();
    vm.paymentMethodLoader = true;
    vm.isFreeTrial = true;
    vm.transferPayment = false;
    vm.changePaymentMethod = false;
    vm.paymentMetodInfo = { cc: {number: '', brand: {}, mask: ''}, secCode: {number: '', mask: ''}, expDate: ''};
    vm.paymentMethodSaved = false;
    vm.validationPaymentFailure = false;

    function activate() {
      vm.resources = resources.data;
      vm.paymentMethodLoader = true;
      vm.paymentMetodInfo = { cc: {number: '', brand: {}, mask: ''}, secCode: {number: '', mask: ''}, carHolder: '', expDate: ''};
      vm.changePaymentMethod = false;
      vm.validationPaymentFailure = false;
      
      settings.getCurrentPlanInfo().then(function(response) {
        vm.isFreeTrial = !(response.data.fee && response.data.includedDeliveries);
        if (!vm.isFreeTrial) {
          initializeCreditCardProperties(response.data);
        } else {
          vm.paymentMethodLoader = false;
        }
      })
    }

    vm.checkExpDate = checkExpDate;
    vm.submitPaymentMethod = submitPaymentMethod;
    vm.showChangePaymentMethod = showChangePaymentMethod;
    vm.cancelAction = cancelAction;
    vm.cc = {number: '', brand: {}, mask: ''};
    vm.secCode = {number: '', mask: ''};
    vm.maskOptions = {
      allowInvalidValue: true, //allows us to watch the value
      clearOnBlur: false
    };

    $scope.$watch('vm.cc.number', fillCreditCardProperties);

    function showChangePaymentMethod(){
      vm.changePaymentMethod = true;
      vm.cc.number = '';
      vm.secCode.number = '';
      vm.cardHolder = '';
      vm.expDate = '';
    }

    function initializeCreditCardProperties(data) {
      vm.transferPayment = !data.paymentMethod;
      if (data.paymentMethod && data.paymentMethod.creditCard) {
        vm.paymentMetodInfo.cardHolder = data.paymentMethod.creditCard.cardHoldersName;

        if (data.paymentMethod.creditCard.expiryDate) {
          var year = data.paymentMethod.creditCard.expiryDate.slice(2,4);
          var month = data.paymentMethod.creditCard.expiryDate.slice(0,2);
          vm.paymentMetodInfo.expDate = month + '/' + year;
        }

        vm.paymentMetodInfo.cc.brand = data.paymentMethod.creditCard.cardBrand;
        vm.paymentMetodInfo.cc.number = data.paymentMethod.creditCard.cardNumber.replaceAll('#','*');
        vm.paymentMetodInfo.secCode.mask = getMaskSecCodByBrand(vm.paymentMetodInfo.cc.brand);
        vm.paymentMetodInfo.secCode.number = vm.paymentMetodInfo.secCode.mask.replaceAll('9','*');
      }

      vm.paymentMethodLoader = false;
    }

    function fillCreditCardProperties(newNumber) {
      vm.cc.brand = getCreditCardBrand(newNumber);
      vm.cc.mask = getMaskByBrand(vm.cc.brand);
      vm.secCode.mask = getMaskSecCodByBrand(vm.cc.brand);
      vm.cc.number = newNumber;
    }

    function getMaskSecCodByBrand(cardBrand){
      return secCodeMasksByBrand[cardBrand];
    }

    function getMaskByBrand(cardBrand){
      return creditCardMasksByBrand[cardBrand];
    }

    function getCreditCardBrand(creditCardNumber) {
    	// start without knowing the credit card brand
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
      if (input.$modelValue && input.$modelValue.length == 4) {
        var year = input.$modelValue.slice(2);
        var month = input.$modelValue.slice(0,2);
        if (year < currentYear || month > 12) {
          utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
        }
        if (year == currentYear && month < currentMonth) {
          utils.setServerValidationToField($scope, $scope.form.expDate, 'ilegal_date');
        }
      }
    }

    var onExpectedError = function (rejectionData) {
      vm.validationPaymentFailure = true;
      return true;
    };

    function submitPaymentMethod(form) {
      if (!utils.validateCreditCard(vm.cc.number)) {
        utils.setServerValidationToField($scope, form.cardNumber, 'invalid_card_number');
      }
      if (!form.$valid) {
        return;
      }
      vm.cc.parsedCcNumber = utils.replaceAllCharsExceptLast4(vm.cc.number);
      vm.secCode.ParsedNumber = utils.replaceAllCharsExceptLast4(vm.secCode.number);
      vm.viewExpDate = form.expDate.$viewValue;

      var paymentMethod = {
        creditCard: {
          cardNumber: vm.cc.number,
          verificationCode: vm.secCode.number,
          expiryDate: vm.expDate,
          cardHoldersName: vm.cardHolder
        }
      };

      settings.updatePaymentMethod(paymentMethod, onExpectedError)
      .then(function() {
        vm.paymentMethodSaved = true;
        activate();
      });
    }

    function cancelAction() {
      vm.changePaymentMethod = false;
    }
  }
})();
