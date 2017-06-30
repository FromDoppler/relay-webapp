(function() {
  'use strict';

  angular
    .module('dopplerRelay')
    .controller('PlanCtrl', PlanCtrl);

  PlanCtrl.$inject = [
    '$scope',
    '$location',
    '$rootScope',
    'auth',
    '$translate',
    '$timeout',
    'settings',
    '$filter'
  ];

  function PlanCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, $filter) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
    ]);
    vm.hideDragMe = false;
    vm.activationPromise = activate();
    var defaultPlanName = 'PLAN-60K';
    var planItems;
    vm.langUsed = $translate.use();
    vm.showPricingChart = showPricingChart;
    vm.pricingChartDisplayed = false;
    vm.planInfoLoader = true;

    function activate() {
      settings.getCurrentPlanInfo().then(function(response) {
        vm.currentPlanPrice = response.data.fee;
        vm.currentPlanEmailsAmount = response.data.includedDeliveries;
        vm.currentPlanEmailPrice = response.data.extraDeliveryCost;
      })
      .finally(function () {
        vm.planInfoLoader = false;
      });
      return settings.getPlansAvailable().then(function(response) {
        planItems = response.data.items;
        loadSlider();
        changePlan(defaultPlanName);
      });
    }

    function changePlan(planName) {
      var selectedItem = planItems.find(function(obj){
        return obj.name == planName;
      });
      if (!selectedItem) {
        selectedItem = planItems[0];
        vm.hideDragMe = true;
      }
      vm.emailsSuggestedAmount = selectedItem.included_deliveries;
      vm.planName = selectedItem.name;
      vm.planPrice = selectedItem.fee;
      vm.costEmail = selectedItem.extra_delivery_cost;
    }

    function loadSlider() {
      planItems = $filter('orderBy')(planItems,'included_deliveries');
      var planItemsParsedForSlider = planItems.map(function(plan){
        return { value : plan.name};
      });
      vm.slider = {
        value: defaultPlanName,
        options: {
          showSelectionBar: true,
          showTicks: true,
          stepsArray: planItemsParsedForSlider,
          onChange: function (sliderId, modelValue) {
            vm.hideDragMe = true;
            changePlan(modelValue);
          }
        }
      };
    }

    function showPricingChart() {
        vm.pricingChartDisplayed = true;
    }
  }

})();
