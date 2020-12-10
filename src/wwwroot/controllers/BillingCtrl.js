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
            vm.lastname = response.data.billingInformation.lastname;
            vm.company = response.data.billingInformation.companyName;
            vm.address = response.data.billingInformation.address;
            vm.city = response.data.billingInformation.city;
            vm.zCode = response.data.billingInformation.zipCode;
            vm.country = getCountryByCode(response.data.billingInformation.countryCode);
            vm.consumerType = getConsumerTypeByCode(response.data.billingInformation.consumerType);
            vm.province = getProvinceByCode(response.data.billingInformation.provinceCode);
            fillFiscalInformationByType(
              response.data.billingInformation.fiscalIdType,
              response.data.billingInformation.fiscalId);
          }
        });

      });
    }
    vm.checkExpDate = checkExpDate;
    vm.submitBilling = submitBilling;
    vm.submitBillingPayment = submitBillingPayment;
    vm.resetInputs = resetInputs;
    vm.changeCountry = changeCountry;

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

    $scope.$watch('vm.cuit', fillCustomerData);

    $scope.$watch('vm.country.code', getConsumerTypes);

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

    function fillCustomerData(cuit) {
      if (cuit && cuit.length >= 11) {
        settings.getCustomerDataByCuit(cuit).then(function(result) {
          vm.company = result.data.RazonSocial,
          vm.address = result.data.DomicilioDireccion,
          vm.province = getProvinceByCode(result.data.DomicilioProvincia),
          vm.city = result.data.DomicilioLocalidad,
          vm.zCode = result.data.DomicilioCodigoPostal
        });
      }
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

      var fiscalIdtype;
      var fiscalId;
      var provinceCode;

      if (vm.idFiscal && vm.idFiscal != '') {
        fiscalIdtype = "FID";
        fiscalId = vm.idFiscal;
      }
      
      if (vm.cuit && vm.cuit != '' && vm.cuit.length >= 11) {
        fiscalIdtype = "CUIT";
        fiscalId = vm.cuit;
      }

      if (vm.dni) {
        fiscalIdtype = "DNI";
        fiscalId = vm.dni;
      }

      provinceCode = vm.province ? vm.province.code : "99";

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
          lastname: vm.lastname,
          companyName:vm.company,
          address: vm.address,
          city: vm.city,
          zipCode: vm.zCode,
          consumerType: vm.consumerType.code,
          fiscalId: fiscalId,
          fiscalIdType: fiscalIdtype,
          countryCode: vm.country.code,
          provinceCode: provinceCode
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

    function getConsumerTypes(countryCode) {
      vm.filteredConsumerTypes = vm.resources.consumerType.slice();

      if (countryCode && countryCode != 'AR') {   
        vm.filteredConsumerTypes = vm.resources.consumerType.filter(function(obj) {
          if (obj.code == 'IN' || obj.code == 'EM') {
            return true;
          }
        });
      }

      if (countryCode && countryCode == 'AR') {
        vm.filteredConsumerTypes = vm.resources.consumerType.filter(function(obj) {
          if (obj.code != 'IN' && obj.code != 'EM') {
            return true;
          }
        });
      }
    }

    function getCountryByCode(countryCode) {
      return vm.resources.countries.find(function(obj){
        return obj.code == countryCode;
      });
    }

    function getConsumerTypeByCode(consumerTypeCode)
    {
      return vm.resources.consumerType.find(function(obj){
        return obj.code == consumerTypeCode;
      });
    }

    function getProvinceByCode(provinceCode) {
      return vm.country.provinces.find(function(obj){
        return obj.code == provinceCode;
      });
    }

    function fillFiscalInformationByType(fiscalIdType, fiscalId)
    {
      switch (fiscalIdType) {
        case "FID":
          vm.idFiscal = fiscalId;
          break;
        case "DNI":
          vm.dni = fiscalId;
          break;
        case "CUIT":
          vm.cuit = fiscalId;
      }
    }

    function resetInputs() {
      vm.idFiscal = '';
      vm.dni = '';
      vm.cuit = '';
      vm.name = '';
      vm.lastname = '';
      vm.company = '';
      vm.province = '';
      vm.address = '';
      vm.city = '';
      vm.zCode = '';
    }

    function changeCountry(form, country) {
      form.country.$modelValue = country;
      vm.province = '';
    }
  }
})();
