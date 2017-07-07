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
  function BillingCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, utils, resources, ModalService) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);
    var queryParams = $location.search();
    var planName = queryParams['plan'];
    vm.activationPromise = activate();
    vm.redirectToPlanSelection = redirectToPlanSelection;

    function activate() {

      resources.ensureCountries();
      vm.resources = resources.data;

      if (!planName) {
        return redirectToPlanSelection();
      }
      vm.planName = planName;
      return settings.getPlansAvailable().then(function(response){
        var planSelected = response.data.items.find(function(obj){
          return obj.name == planName;
        });
        if (!planSelected) {
          return redirectToPlanSelection();
        }
        vm.currentCurrency = planSelected.currency;
        vm.planPrice = planSelected.fee;
      });
    }
    vm.checkExpDate = checkExpDate;
    vm.submitBilling = submitBilling;
    vm.submitBillingPayment = submitBillingPayment;

    vm.cc = {number: '', brand: {}, mask: ''};
    vm.secCode = {number: '', mask: ''};
    vm.maskOptions = {
      allowInvalidValue: true, //allows us to watch the value
      clearOnBlur: false
    };

    function redirectToPlanSelection() {
      $location.path('/settings/my-plan');
    }

    $scope.$watch('vm.cc.number', fillCreditCardProperties);

    function fillCreditCardProperties(newNumber) {
      vm.cc.brand = getCreditCardBrand(newNumber);
      vm.cc.mask = getMaskByBrand(vm.cc.brand);
      vm.secCode.mask = getMaskSecCodByBrand(vm.cc.brand);
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

    var onExpectedError = function (rejectionData) {
      vm.paymentFailure = true;
      return true;
    };

    function submitBilling(form) {
      vm.submitted = true;
      if (!utils.validateCreditCard(vm.cc.number)) {
        utils.setServerValidationToField($scope, $scope.form.cardNumber, 'ilegal_number');
      }
      if (!form.$valid) {
        return;
      }

      vm.showConfirmation = true;
      vm.cc.parsedCcNumber = utils.replaceAllCharsExceptLast4(vm.cc.number);
      vm.secCode.ParsedNumber = utils.replaceAllCharsExceptLast4(vm.secCode.number);
      vm.viewExpDate = form.expDate.$viewValue;
    }
    function submitBillingPayment() {
      var agreement = {
         planName: planName,
         paymentMethod: {
           creditCard: {
             cardNumber: vm.cc.number,
             verificationCode: vm.secCode.number,
             expiryDate: vm.expDate,
             cardHoldersName: vm.cardHolder,
             cardBrand: vm.cc.brand
           }
         },
         billingInformation: {
           name: vm.name,
           companyName:vm.company,
           address: vm.address,
           city: vm.city,
           zipCode: vm.zCode,
           countryCode: vm.country.code
         }
      };
      return settings.billingPayment(agreement, onExpectedError)
      .then(function() {
        return ModalService.showModal({
        templateUrl: 'partials/modals/general-template.html',
        controller: 'GeneralTemplateCtrl',
        controllerAs: 'vm',
        inputs: {
          title: "success_upgrade_title",
          mainText: "success_upgrade_text",
          buttonText: "success_upgrade_button"
        }
        })
        .then(function (modal) {
          modal.close.then(redirectToPlanSelection);
        });
      });
    }
  }

})();
