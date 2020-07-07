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
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: false }
    ]);
    var queryParams = $location.search();
    var planName = queryParams['plan'];
    vm.activationPromise = activate();
    vm.redirectToPlanSelection = redirectToPlanSelection;
    vm.cancelAction = cancelAction;

    function activate() {

      resources.ensureCountries();
      resources.ensureConsumerType();
      resources.ensureProvinces();
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
        vm.planPrice = planSelected.fee + (planSelected.ips_count * planSelected.cost_by_ip || 0);

        return settings.getCurrentPlanInfo().then(function(response) {
          
          var currentPlanPrice = response.data.fee + (response.data.ips_count * response.data.cost_by_ip || 0);
          if(currentPlanPrice >= vm.planPrice){
            vm.showConfirmation = true;
            vm.downgrade = true;
          }

          if(response.data.billingInformation){
            vm.name = response.data.billingInformation.name;
            vm.company = response.data.billingInformation.companyName;
            vm.address = response.data.billingInformation.address;
            vm.city = response.data.billingInformation.city;
            vm.zCode = response.data.billingInformation.zipCode;       
            resources.ensureCountries().then(function(){
              vm.country = vm.resources.countries.find(function(obj){
                return obj.code == response.data.billingInformation.countryCode;
              });
            });     
            
          }
        });

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
    vm.processingPayment = false;

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
      vm.paymentFailure = true;
      return true;
    };

    function submitBilling(form) {
      vm.submitted = true;
      if (!utils.validateCreditCard(vm.cc.number)) {
        utils.setServerValidationToField($scope, $scope.form.cardNumber, 'invalid_card_number');
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
      if (vm.downgrade) {
        downgrade();
        return;
      }

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

     vm.processingPayment = true;

      return settings.billingPayment(agreement, onExpectedError)
      .then(function() {
        return ModalService.showModal({
        templateUrl: 'partials/modals/general-template.html',
        controller: 'GeneralTemplateCtrl',
        controllerAs: 'vm',
        inputs: {
          title: "success_upgrade_title",
          mainText: "success_upgrade_text",
          buttonText: "success_upgrade_button",
          action: null
        }
        })
        .then(function (modal) {
          modal.close.then(redirectToPlanSelection);
        });
      }).finally(function(){
        vm.processingPayment = false;
      });
    }

    function downgrade() {
      ModalService.showModal({
        templateUrl: 'partials/modals/confirm-input-template.html',
        controller: 'ConfirmInputTemplate',
        controllerAs: 'vm',
        inputs: {
          title: "downgrade_popup_title",
          mainText: "downgrade_popup_main_text",
          descriptionInput: "downgrade_popup_confirm_text",
          confirmationWord: "downgrade_popup_confirm_word",
          actionSuccess: downgradeAction,
          cancelButtonText: "downgrade_popup_cancel_button",
          buttonText: "confirm_text"
        }
      })
      .then(function (modal) {
        modal.close.then(redirectToPlanSelection);
      });
    }
    function downgradeAction() {   
      var agreement = { planName: planName };
      return settings.downgrade(agreement, onExpectedError).then(function(){
        redirectToPlanSelection();
      });      
    }
    function cancelAction() {
      if (!vm.downgrade) {
        vm.showConfirmation = false;
        vm.paymentFailure = false;
        return;
      }
      redirectToPlanSelection();
    }
  }

})();
