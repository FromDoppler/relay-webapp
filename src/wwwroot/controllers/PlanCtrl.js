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
      { text: 'submenu_my_plan', url: 'settings/my-plan', active: true },
      { text: 'submenu_my_billing_information', url: 'settings/my-billing-information', active: false }
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
    vm.isValidUpgradeablePlan = isValidUpgradeablePlan;
    vm.requiresDomainConfiguration = requiresDomainConfiguration;
    vm.requiresDeliveries = requiresDeliveries;
    function activate() {
      var getCurrentPlanInfo = settings.getCurrentPlanInfo().then(function(response) {
        vm.currentPlanPrice = response.data.fee + (response.data.ips_count * response.data.cost_by_ip || 0);
        vm.currentPlanEmailsAmount = response.data.includedDeliveries;
        vm.currentPlanEmailPrice = response.data.extraDeliveryCost;
        vm.currency = response.data.currency;
        // TODO: improve it splitting free trial and free accounts behavior
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
            // TODO: consider prepare these two values isAccountCanceled and isTrialEnded in backend in place of accountClosed
            vm.isAccountCanceled = result.data.accountClosed && result.data.cancellationDate; 
            vm.isTrialEnded = result.data.accountClosed && !result.data.cancellationDate;
            vm.trialEndDate = result.data.trialEndDate;
            vm.cancellationDate = result.data.cancellationDate;
            vm.hasCancellationDate = !!result.data.cancellationDate;
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

      vm.includesIp = false;        

      vm.PlanName = basic ? basic.name : pro.name;
      vm.PlanPrice = basic ? basic.fee : pro.fee + (pro.ips_count * pro.cost_by_ip || 0);
      vm.CostEmail = basic ? basic.extra_delivery_cost : pro.extra_delivery_cost;
      vm.disablePlan = basic ? isCurrentPlan(basic) : isCurrentPlan(pro);
      vm.includesIp = !basic;
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

    function isValidUpgradeablePlan() {
      return !requiresDomainConfiguration() && !requiresDeliveries() && !vm.hasCancellationDate;
    }
  
    function requiresDomainConfiguration() {
      return !!$rootScope.accountLimits.requiresDomainConfiguration;
    }

    function requiresDeliveries(){
      return !!$rootScope.accountLimits.requiresDeliveries;
    }
  }

})();
