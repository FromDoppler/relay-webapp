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
        vm.currentIpsPlanCount = response.data.ips_count || 0;
        vm.hasScheduledPlan = !response.data.endDate;
        vm.hideDragMe = !vm.isFreeTrial;
        defaultPlanDeliveries = !vm.isFreeTrial ? response.data.includedDeliveries.toString() : defaultPlanDeliveries; 
        if (!vm.hasScheduledPlan) {
          settings.getNextPlan().then(function(response){
            vm.nextPlanIncludedDeliveries = response.data.includedDeliveries;
          });
        }
      })
      .finally(function () {
        vm.planInfoLoader = false;
      });
      var getPlansAvailable = settings.getPlansAvailable().then(function(response) {
        planItems = response.data.items;
      });
      return Promise.all([getPlansAvailable, getCurrentPlanInfo, getMonthConsumption()]).then(function(){        
        ensureValidDefaultPlanDelivery();
        loadSlider();
        changePlan(defaultPlanDeliveries);        
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
      
      vm.ipsPlanCount = pro ? pro.ips_count : 0;

      if (!basic) {
        vm.showPremiumPlanBox = true;

        vm.leftPlanName = pro.name;
        vm.leftPlanPrice = pro.fee + (pro.ips_count * pro.cost_by_ip || 0);
        vm.leftCostEmail = pro.extra_delivery_cost;
        vm.disableLeftPlan = isCurrentPlan(pro);

        vm.rightPlanName = 'Premium';
        vm.rightCostEmail = pro.extra_delivery_cost;
        vm.disableRightPlan = false;
      } else {
        vm.showPremiumPlanBox = false;        

        vm.leftPlanName = basic.name;
        vm.leftPlanPrice = basic.fee;
        vm.leftCostEmail = basic.extra_delivery_cost;
        vm.disableLeftPlan = isCurrentPlan(basic);

        if (pro) {
          vm.rightPlanName = pro.name;
          vm.rightPlanPrice = pro.fee + (pro.ips_count * pro.cost_by_ip || 0);
          vm.rightCostEmail = pro.extra_delivery_cost;
          vm.disableRightPlan = isCurrentPlan(pro);
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

    function isCurrentPlan(plan){
      return plan.included_deliveries == vm.currentPlanEmailsAmount && vm.currentIpsPlanCount == plan.ips_count        
    }

    function ensureValidDefaultPlanDelivery(){           
      var selectedItems = planItems.filter(function(obj){
        return obj.included_deliveries == defaultPlanDeliveries;
      });

      if (selectedItems.length < 1) {
        var defaultPlanSuggested = planItems.reduce(function(prev, curr) {
          return (Math.abs(curr.included_deliveries - defaultPlanDeliveries) < Math.abs(prev.included_deliveries - defaultPlanDeliveries) ? curr : prev);
        });    
        
        defaultPlanDeliveries = defaultPlanSuggested.included_deliveries.toString();
      }      
    }

  }

})();
