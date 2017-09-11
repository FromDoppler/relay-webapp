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
    'moment',
    'utils'
  ];

  function PlanCtrl($scope, $location, $rootScope, auth, $translate, $timeout, settings, $filter, reports, moment, utils) {
    var vm = this;
    $rootScope.setSubmenues([
      { text: 'submenu_my_profile', url: 'settings/my-profile', active: false },
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: true }
    ]);
    vm.hideDragMe = false;
    vm.activationPromise = activate();
    var defaultPlanDeliveries = '60000';
    var planItems;
    vm.langUsed = $translate.use();
    vm.showPricingChart = showPricingChart;
    vm.pricingChartDisplayed = false;
    vm.planInfoLoader = true;
    vm.planStatusInfoLoader = true;
    vm.ipsPlanCount = 0;

    function activate() {
      var getCurrentPlanInfo = settings.getCurrentPlanInfo().then(function(response) {
        vm.currentPlanPrice = response.data.fee + (response.data.ips_count * response.data.cost_by_ip || 0);
        vm.currentPlanEmailsAmount = response.data.includedDeliveries;
        vm.currentPlanEmailPrice = response.data.extraDeliveryCost;
        vm.currency = response.data.currency;
        vm.isFreeTrial = response.data.fee && response.data.includedDeliveries ? false : true;
        vm.isPro = response.data.ips_count ? true : false;
        vm.currentIpsPlanCount = response.data.ips_count || 0;
        if (!vm.isFreeTrial){
          vm.hideDragMe = true;
          defaultPlanDeliveries = response.data.includedDeliveries.toString();
        }
      })
      .finally(function () {
        vm.planInfoLoader = false;
      });
      var getPlansAvailable = settings.getPlansAvailable().then(function(response) {
        planItems = response.data.items;
      });
      return Promise.all([getPlansAvailable, getCurrentPlanInfo, getMonthConsumption()]).then(function() {        
        
        changePlan(defaultPlanDeliveries);
        loadSlider();
      });
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

    function changePlan(planDeliveries) {
      vm.emailsSuggestedAmount = planDeliveries;
      var selectedItems = planItems.filter(function(obj){
        return obj.included_deliveries == planDeliveries;
      });

      if (selectedItems.length < 1) {
        var newPlanSuggestedByDeliveries = planItems.reduce(function(prev, curr) {
          return (Math.abs(curr - planDeliveries) < Math.abs(prev - planDeliveries) ? curr : prev);
        });
        selectedItems = planItems.filter(function(obj){
          return obj.included_deliveries == newPlanSuggestedByDeliveries.included_deliveries;
        });
        vm.emailsSuggestedAmount = newPlanSuggestedByDeliveries.included_deliveries;
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
        if (!vm.isFreeTrial) {
          if (defaultPlanDeliveries == pro.included_deliveries) {
            vm.isLeftCurrentPlan = true;
          } else {
            vm.isLeftCurrentPlan = false;
          }
        }
        vm.leftPlanName = pro.name;
        vm.leftPlanPrice = pro.fee + (pro.ips_count * pro.cost_by_ip || 0);
        vm.leftCostEmail = pro.extra_delivery_cost;

        vm.rightPlanName = 'Premium';
        vm.rightCostEmail = pro.extra_delivery_cost;
      } else {
        vm.showPremiumPlanBox = false;  
        if (!vm.isFreeTrial) {
          if (defaultPlanDeliveries == basic.included_deliveries && !vm.isPro) {
            vm.isLeftCurrentPlan = true;
          } else {
            vm.isLeftCurrentPlan = false;
          }
        }
        vm.leftPlanName = basic.name;
        vm.leftPlanPrice = basic.fee;
        vm.leftCostEmail = basic.extra_delivery_cost;
        if (pro) {
          if (!vm.isFreeTrial) {
            if (defaultPlanDeliveries == pro.included_deliveries && vm.isPro) {
              vm.isRightCurrentPlan = true;
            } else {
              vm.isRightCurrentPlan = false;
            }
          }
          vm.ipsPlanCount = pro.ips_count;
          vm.rightPlanName = pro.name;
          vm.rightPlanPrice = pro.fee + (pro.ips_count * pro.cost_by_ip || 0);
          vm.rightCostEmail = pro.extra_delivery_cost;
        }
      }
    }

    function loadSlider() {
      
      var items = planItems.map(function(plan) {
        return parseInt(plan.included_deliveries);
      });
      items = utils.removeDuplicates(items);
      items.sort(function(a, b) {
        return a - b;
      });

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