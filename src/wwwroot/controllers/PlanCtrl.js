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
    '$filter',
    'reports',
    'moment'
  ];

  function PlanCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, $filter, reports, moment) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: true }
    ]);
    vm.hideDragMe = false;
    vm.activationPromise = activate();
    var defaultPlanName = 'PLAN-60K';
    var planItems;
    vm.langUsed = $translate.use();
    vm.showPricingChart = showPricingChart;
    vm.pricingChartDisplayed = false;
    vm.planInfoLoader = true;
    vm.planStatusInfoLoader = true;

    function activate() {
      var getCurrentPlanInfo = settings.getCurrentPlanInfo().then(function(response) {
        vm.currentPlanPrice = response.data.fee;
        vm.currentPlanEmailsAmount = response.data.includedDeliveries;
        vm.currentPlanEmailPrice = response.data.extraDeliveryCost;
        vm.currency = response.data.currency;
        vm.isFreeTrial = response.data.fee && response.data.includedDeliveries ? false : true;
      })
      .finally(function () {
        vm.planInfoLoader = false;
      });
      var getPlansAvailable = settings.getPlansAvailable().then(function(response) {
        planItems = response.data.items;
        loadSlider();
        changePlan(defaultPlanName);
      });
      return Promise.all([getPlansAvailable, getCurrentPlanInfo, getMonthConsumption()]);
    }

    function getMonthConsumption() {
      return settings.getStatusPlanInfo()
          .then(function (result) {
            vm.extraEmailsSent = 0;
            vm.resetDate = result.data.endDate;
            vm.currentMonthlyCount = result.data.deliveriesCount;
            vm.planStatusInfoLoader = false;
            if (vm.currentPlanEmailsAmount < vm.currentMonthlyCount) {
              vm.extraEmailsSent = vm.currentMonthlyCount - vm.currentPlanEmailsAmount;
            }
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
