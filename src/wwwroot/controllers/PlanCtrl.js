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
        changePlan(defaultPlanDeliveries);
      });
      return Promise.all([getPlansAvailable, getCurrentPlanInfo, getMonthConsumption()]);
    }

    function getMonthConsumption() {
      return settings.getStatusPlanInfo()
          .then(function (result) {
            vm.extraEmailsSent = 0;
            vm.isAccountClosed = result.data.accountClosed;
            vm.accountEndDate = result.data.accountEndDate;
            vm.resetDate = result.data.endDate;
            vm.currentMonthlyCount = result.data.deliveriesCount;
            vm.planStatusInfoLoader = false;
            if (vm.currentPlanEmailsAmount < vm.currentMonthlyCount) {
              vm.extraEmailsSent = vm.currentMonthlyCount - vm.currentPlanEmailsAmount;
            }
          });
    }

      var selectedItem = planItems.find(function(obj){
        return obj.name == planName;
    function changePlan(planDeliveries) {
      var selectedItems = planItems.filter(function(obj){
        return obj.included_deliveries == planDeliveries;
      });

      if (!selectedItems) {
        selectedItems = planItems[0];
        vm.hideDragMe = true;
      }

      var basic = selectedItems.find(function(plan){
        return plan.type != "pro";
      });
      var pro = selectedItems.find(function(plan){
        return plan.type == "pro";
      });
      
      if (!basic) {
        vm.showPremiumPlanBox = true;

        vm.leftPlanName = pro.name;
        vm.leftPlanPrice = pro.fee + pro.ips_count * pro.cost_by_ip;
        vm.leftCostEmail = pro.extra_delivery_cost;

        vm.rightPlanName = 'Premium';
        vm.rightPlanPrice = pro.fee + pro.ips_count * pro.cost_by_ip;
        vm.rightCostEmail = pro.extra_delivery_cost;
      } else {
        vm.showPremiumPlanBox = false;

        vm.leftPlanName = basic.name;
        vm.leftPlanPrice = basic.fee;
        vm.leftCostEmail = basic.extra_delivery_cost;

        vm.rightPlanName = pro.name;
        vm.rightPlanPrice = pro.fee + pro.ips_count * pro.cost_by_ip;
        vm.rightCostEmail = pro.extra_delivery_cost;
      }
    }

    function loadSlider() {
      function removeDuplicates(arr){
        var o = {};
        for(var e = 0; e < arr.length; e++) {
          o[arr[e]] = true;
        }
        return Object.keys(o);
      }

      var items = vm.wtfPlans.map(function(plan) {
        return parseInt(plan.included_deliveries);
      });      
      items = removeDuplicates(items);
      items.sort(function(a, b) {
        return a - b;
      }); // agregar polyfill de sort

      vm.slider = {
        value: defaultPlanDeliveries,
        options: {
          showSelectionBar: true,
          showTicks: true,
          stepsArray: items,
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
